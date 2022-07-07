import Crypto
import FungibleToken from "./core/FungibleToken.cdc"

pub contract MyMultiSig {

    // Events
    pub event ActionExecutedByManager(uuid: UInt64)
    pub event ActionApprovedBySigner(address: Address, uuid: UInt64)
    pub event ActionApprovalRevokedBySigner(address: Address, uuid: UInt64)
    pub event ActionCreated(uuid: UInt64, intent: String)
    pub event SignerAdded(address: Address)
    pub event SignerRemoved(address: Address)
    pub event MultiSigThresholdUpdated(oldThreshold: UInt64, newThreshold: UInt64)
    pub event ActionDestroyed(uuid: UInt64)
    pub event ManagerInitialized(initialSigners: [Address], initialThreshold: UInt64)

    //
    // ------- Resource Interfaces ------- 
    //

    pub resource interface MultiSign {
        pub let multiSignManager: @Manager
    }

    //
    // ------- Action Wrapper ------- 
    //

    pub struct interface Action {
        pub let intent: String
        pub fun execute(_ params: {String: AnyStruct})
    }

    //
    // ------- Structs --------
    //

    pub struct MessageSignaturePayload {
        pub let signingAddr: Address
        pub let message: String
        pub let keyIds: [Int]
        pub let signatures: [String]
        pub let signatureBlock: UInt64

        init(_signingAddr: Address, _message: String, _keyIds: [Int], _signatures: [String], _signatureBlock: UInt64) {
            self.signingAddr = _signingAddr
            self.message = _message
            self.keyIds = _keyIds
            self.signatures = _signatures
            self.signatureBlock = _signatureBlock
        }
    }

    pub struct ValidateSignatureResponse {
        pub let isValid: Bool
        pub let totalWeight: UFix64

        init(_isValid: Bool, _totalWeight: UFix64) {
            self.isValid = _isValid
            self.totalWeight = _totalWeight
        }
    }

    //
    // ------- Resources ------- 
    //

    pub resource MultiSignAction {

        pub var totalVerified: UInt64
        pub var accountsVerified: {Address: Bool}
        access(contract) let action: {Action}

        // ZayVerifierv2 - verifySignature
        //
        // Explanation: 
        // Verifies that `acctAddress` is the one that signed the `message` (producing `signatures`) 
        // with the `keyIds` (that are hopefully in its account, or its false) during `signatureBlock`
        //
        // Parameters:
        // acctAddress: the address of the account we're verifying
        // message: {blockId}{uuid of this resource}
        // keyIds: the keyIds that the acctAddress theoretically signed with
        // signatures: the signature that was theoretically produced from the `acctAddress` signing `message` with `keyIds`.
        // can be multiple because you can sign with multiple keys, thus creating multiple signatures.
        // signatureBlock: when the signature was produced
        //
        // Returns:
        // Whether or not this signature is valid
        // Cumulative weight of keys if signature is valid

        pub fun validateSignature(payload: MessageSignaturePayload): ValidateSignatureResponse {
            let keyList = Crypto.KeyList()
            let signingAddr = payload.signingAddr
            let account = getAccount(signingAddr)

            let keyIds = payload.keyIds
            let uniqueKeys: {Int: Bool} = {}
            for id in keyIds {
                uniqueKeys[id] = true
            }
            assert(uniqueKeys.keys.length == keyIds.length, message: "Invalid duplicates of the same keyID provided for signature")

            // In verify we need a [KeyListSignature] so we do that here
            let signatureSet: [Crypto.KeyListSignature] = []
            var totalWeight = 0.0

            var i = 0
            while (i < keyIds.length) {
                let accountKey: AccountKey = account.keys.get(keyIndex: keyIds[i]) ?? panic("Provided key signature does not exist")
                
                let keyWeight = accountKey.weight
                totalWeight = totalWeight + keyWeight

                keyList.add(
                    PublicKey(
                        publicKey: accountKey.publicKey.publicKey,
                        signatureAlgorithm: UInt(accountKey.publicKey.signatureAlgorithm.rawValue) == 2 ? SignatureAlgorithm.ECDSA_secp256k1  : SignatureAlgorithm.ECDSA_P256
                    ),
                    hashAlgorithm: HashAlgorithm.SHA3_256,
                    weight: keyWeight
                )

                var signature = payload.signatures[i]
                signatureSet.append(
                    Crypto.KeyListSignature(
                        keyIndex: keyIds[i],
                        signature: signature.decodeHex()
                    )
                )
                i = i + 1
            }

            let signatureValid = keyList.verify(
                signatureSet: signatureSet,
                signedData: payload.message.utf8
            )

            return ValidateSignatureResponse(_isValid: signatureValid, _totalWeight: totalWeight)
        }

        pub fun signerApproveAction(_messageSignaturePayload: MessageSignaturePayload): Bool {
            pre {
                self.accountsVerified[_messageSignaturePayload.signingAddr] != nil:
                    "This address is not allowed to sign for this."
                !self.accountsVerified[_messageSignaturePayload.signingAddr]!:
                    "This address has already signed."
            }

            // Validate Message
            assert(
                self.approveOrRevokeActionMessageIsValid(_messageSignaturePayload: _messageSignaturePayload),
                message: "Signed message is invalid"
            )
        
            // Validate Signature
            var signatureValidationResponse = self.validateSignature(payload: _messageSignaturePayload)
            assert(signatureValidationResponse.isValid == true, message: "Invalid Signatures")
            assert(signatureValidationResponse.totalWeight >= 999.0, message: "Total weight of combined signatures did not satisfy 999 requirement.")


            // Approve action
            self.accountsVerified[_messageSignaturePayload.signingAddr] = signatureValidationResponse.isValid
            self.totalVerified = self.totalVerified + 1

            emit ActionApprovedBySigner(address: _messageSignaturePayload.signingAddr, uuid: self.uuid)
            return signatureValidationResponse.isValid
        }

        pub fun signerRevokeApproval(_messageSignaturePayload: MessageSignaturePayload): Bool {
            pre {
                self.accountsVerified[_messageSignaturePayload.signingAddr] == true:
                    "Cannot revoke approval -- signer has not approved this action."
            }

            // Validate Message
            assert(
                self.approveOrRevokeActionMessageIsValid(_messageSignaturePayload: _messageSignaturePayload),
                message: "Signed message is invalid"
            )
        
            // Validate Signature
            var signatureValidationResponse = self.validateSignature(payload: _messageSignaturePayload)
            assert(signatureValidationResponse.isValid == true, message: "Invalid Signatures")
            assert(signatureValidationResponse.totalWeight >= 999.0, message: "Total weight of combined signatures did not satisfy 999 requirement.")

            // Revoke approval
            self.accountsVerified[_messageSignaturePayload.signingAddr] = false
            self.totalVerified = self.totalVerified - 1

            emit ActionApprovalRevokedBySigner(address: _messageSignaturePayload.signingAddr, uuid: self.uuid)
            return signatureValidationResponse.isValid
        }

        // Validate the approve/revoke approval message
        pub fun approveOrRevokeActionMessageIsValid(_messageSignaturePayload: MessageSignaturePayload): Bool {
            let signingBlock = getBlock(at: _messageSignaturePayload.signatureBlock)!
            let blockId = signingBlock.id
            let blockIds: [UInt8] = []
            
            var i = 0
            while (i < blockId.length) {
                blockIds.append(blockId[i])
                i = i + 1
            }

            // message: {uuid of this resource}{intent}{blockId}
            let uuidString = self.uuid.toString()
            let intentHex = String.encodeHex(self.action.intent.utf8)
            let blockIdHexStr: String = String.encodeHex(blockIds)

            // Matches the `uuid` of this resource
            let message = _messageSignaturePayload.message
            assert(
                uuidString == message.slice(from: 0, upTo: uuidString.length), 
                message: "This signature is not for this action"
            )
            // Matches the `intent` of this resource
            assert(
                intentHex == message.slice(from: uuidString.length, upTo: uuidString.length + intentHex.length), 
                message: "Failed to validate intent"
            )
            // Ensure that the message passed in is of the current block id...
            assert(
                blockIdHexStr == message.slice(from: uuidString.length + intentHex.length, upTo: message.length), 
                message: "Unable to validate signature provided contained a valid block id."
            )
            return true
        }

        init(_signers: [Address], _intent: String, _action: {Action}) {
            self.totalVerified = 0
            self.accountsVerified = {}
            self.action = _action
            
            for signer in _signers {
                self.accountsVerified[signer] = false
            }
        }
    }

    pub resource interface ManagerPublic {
        pub fun borrowAction(actionUUID: UInt64): &MultiSignAction
        pub fun getIDs(): [UInt64]
        pub fun getIntents(): {UInt64: String}
        pub fun getSigners(): {Address: Bool}
        pub fun getThreshold(): UInt64
        pub fun getVerifiedSignersForAction(actionUUID: UInt64): {Address: Bool}
        pub fun getTotalVerifiedForAction(actionUUID: UInt64): UInt64
    }
    
    pub resource Manager: ManagerPublic {
        access(account) let signers: {Address: Bool}
        pub var threshold: UInt64

        // Maps the `uuid` of the MultiSignAction
        // to the resource itself
        access(self) var actions: @{UInt64: MultiSignAction}

        pub fun createMultiSign(action: {Action}): UInt64 {
            let newAction <- create MultiSignAction(_signers: self.signers.keys, _intent: action.intent, _action: action)
            let uuid = newAction.uuid
            self.actions[newAction.uuid] <-! newAction
            emit ActionCreated(uuid: uuid, intent: action.intent)
            return uuid
        }

        pub fun addSigner(signer: Address) {
            self.signers.insert(key: signer, true)
            emit SignerAdded(address: signer)
        }

        pub fun removeSigner(signer: Address) {
            self.signers.remove(key: signer)
            emit SignerRemoved(address: signer)
        }

        pub fun updateThreshold(newThreshold: UInt64) {
            let oldThreshold = self.threshold
            self.threshold = newThreshold
            emit MultiSigThresholdUpdated(oldThreshold: oldThreshold, newThreshold: newThreshold)
        }

        pub fun destroyAction(actionUUID: UInt64) {
            let removedAction <- self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
            destroy removedAction
            emit ActionDestroyed(uuid: actionUUID)
        }

        pub fun readyToExecute(actionUUID: UInt64): Bool {
            let actionRef: &MultiSignAction = (&self.actions[actionUUID] as &MultiSignAction?)!
            return actionRef.totalVerified >= self.threshold
        }

        pub fun executeAction(actionUUID: UInt64, _ params: {String: AnyStruct}) {
            pre {
                self.readyToExecute(actionUUID: actionUUID):
                    "This action has not received a signature from every signer yet."
            }
            
            let action <- self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
            action.action.execute(params)
            emit ActionExecutedByManager(uuid: actionUUID)
            destroy action
        }

        pub fun borrowAction(actionUUID: UInt64): &MultiSignAction {
            return (&self.actions[actionUUID] as &MultiSignAction?)!
        }

        pub fun getIDs(): [UInt64] {
            return self.actions.keys
        }

        pub fun getIntents(): {UInt64: String} {
            let returnVal: {UInt64: String} = {}
            for id in self.actions.keys {
                returnVal[id] = self.borrowAction(actionUUID: id).action.intent
            }
            return returnVal
        }

        pub fun getSigners(): {Address: Bool} {
            return self.signers
        }

        pub fun getThreshold(): UInt64 {
            return self.threshold
        }

        pub fun getVerifiedSignersForAction(actionUUID: UInt64): {Address: Bool} {
            return self.borrowAction(actionUUID: actionUUID).accountsVerified
        }

        pub fun getTotalVerifiedForAction(actionUUID: UInt64): UInt64 {
            return self.borrowAction(actionUUID: actionUUID).totalVerified
        }

        init(_initialSigners: [Address], _initialThreshold: UInt64) {
            self.signers = {}
            self.actions <- {}
            self.threshold = _initialThreshold

            for signer in _initialSigners {
                self.signers.insert(key: signer, true)
            }
            emit ManagerInitialized(initialSigners: _initialSigners, initialThreshold: _initialThreshold)
        }

        destroy() {
            destroy self.actions
        }
    }

    // 
    // ------- Functions --------
    //
        
    pub fun createMultiSigManager(signers: [Address], threshold: UInt64): @Manager {
        return <- create Manager(_initialSigners: signers, _initialThreshold: threshold)
    }
}