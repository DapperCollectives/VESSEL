import Crypto
import FungibleToken from "./core/FungibleToken.cdc"
import FCLCrypto from "./core/FCLCrypto.cdc"

pub contract MyMultiSigV4 {

    //
    // ------- Resource Interfaces ------- 
    //

    pub resource interface MultiSign {
        access(contract) let multiSignManager: @Manager
    }

    pub resource interface ManagerPublic {
        pub fun borrowAction(actionUUID: UInt64): &MultiSignAction
        pub fun getIDs(): [UInt64]
        pub fun getIntents(): {UInt64: String}
        pub fun getSigners(): {Address: Bool}
        pub fun getThreshold(): UInt
        pub fun getSignerResponsesForAction(actionUUID: UInt64): {Address: UInt}
        pub fun getTotalApprovedForAction(actionUUID: UInt64): Int
        pub fun getTotalRejectedForAction(actionUUID: UInt64): Int
    }

    //
    // ------- Struct Interfaces ------- 
    //

    // Interface for actions implemented in TreasuryActions contract
    pub struct interface Action {
        pub let intent: String
        pub let proposer: Address
        pub fun getView(): ActionView
        access(account) fun execute(_ params: {String: AnyStruct})
    }

    //
    // ------- Structs ------- 
    //

    // General View Struct for Actions
    pub struct ActionView {
        pub var type: String
        pub var intent: String
        pub var proposer: Address
        pub(set) var recipient: Address?
        pub(set) var vaultId: String?
        pub(set) var collectionId: String?
        pub(set) var nftId: UInt64?
        pub(set) var tokenAmount: UFix64?
        pub(set) var signerAddr: Address?
        pub(set) var newThreshold: UInt?

        init(
            type: String, intent: String, proposer: Address, recipient: Address?,
            vaultId: String?, collectionId: String?, nftId: UInt64?, tokenAmount: UFix64?,
            signerAddr: Address?, newThreshold: UInt?
        ) {
            self.type = type 
            self.intent = intent
            self.proposer = proposer
            self.recipient = recipient
            self.vaultId = vaultId
            self.collectionId = collectionId
            self.nftId = nftId
            self.tokenAmount = tokenAmount
            self.signerAddr = signerAddr
            self.newThreshold = newThreshold
        }
    }

    // Struct for actions that require a signature
    // to be submitted by a signer on the Treasury
    pub struct MessageSignaturePayload {
        pub let signingAddr: Address
        pub let message: String
        pub let keyIds: [Int]
        pub let signatures: [String]
        pub let signatureBlock: UInt64

        init(signingAddr: Address, message: String, keyIds: [Int], signatures: [String], signatureBlock: UInt64) {
            self.signingAddr = signingAddr
            self.message = message
            self.keyIds = keyIds
            self.signatures = signatures
            self.signatureBlock = signatureBlock
        }
    }

    //
    // ------- Enums------- 
    //

    pub enum SignerResponse: UInt {
        pub case approved
        pub case rejected
        pub case pending
    }
    
    //
    // ------- Resources ------- 
    //

    pub resource MultiSignAction {

        pub var signerResponses: {Address: SignerResponse}
        access(contract) let action: {Action}

        access(contract) fun setSignerResponse(signer: Address, value: SignerResponse) {
            self.signerResponses[signer] = value
        }

        pub fun getView(): ActionView {
            return self.action.getView()
        }

        init(signers: [Address], action: {Action}) {
            self.signerResponses = {}
            self.action = action
        }
    }
    
    pub resource Manager: ManagerPublic {
        access(account) let signers: {Address: Bool}
        pub var threshold: UInt

        // Maps the `uuid` of the MultiSignAction
        // to the resource itself
        access(self) var actions: @{UInt64: MultiSignAction}
            
        access(account) fun addSigner(signer: Address) {
            pre {
                self.signers[signer] == nil : "Cannot add an already existing signer."
            }
            
            // Checks if the signer exists, get account key will fail otherwise
            getAccount(signer).keys.get(keyIndex: 0)

            self.signers.insert(key: signer, true)
        }

        access(account) fun removeSigner(signer: Address) {
            post {
                self.signers.length >= Int(self.threshold):
                    "Cannot remove signer, number of signers must be equal or higher than the threshold."
            }
            self.signers.remove(key: signer)
        }

        access(account) fun updateThreshold(newThreshold: UInt) {
            post {
                self.signers.length >= Int(self.threshold):
                    "Cannot update threshold, number of signers must be equal or higher than the threshold."
            }

            let oldThreshold = self.threshold
            self.threshold = newThreshold
        }

        access(account) fun executeAction(actionUUID: UInt64, _ params: {String: AnyStruct}) {
            pre {
                self.readyToExecute(actionUUID: actionUUID):
                    "This action has not received a signature from every signer yet. Signed: "
                        .concat(self.getTotalApprovedForAction(actionUUID: actionUUID).toString())
                        .concat(" - Threshold: ")
                        .concat(self.threshold.toString())
            }
            
            let action <- self.actions.remove(key: actionUUID) ?? panic("This action does not exist.")
            action.action.execute(params)
            destroy action
        }

        pub fun createMultiSign(action: {Action}): UInt64 {
            let newAction <- create MultiSignAction(signers: self.signers.keys, action: action)
            let uuid = newAction.uuid
            self.actions[newAction.uuid] <-! newAction
            return uuid
        }

        access(account) fun signerApproveAction(actionUUID: UInt64, messageSignaturePayload: MessageSignaturePayload) {
            pre {
                self.signers[messageSignaturePayload.signingAddr] == true:
                    "This address not a signer on the Treasury."
                self.actions[actionUUID] != nil: "Couldn't find action with UUID ".concat(actionUUID.toString())
                self.borrowAction(actionUUID:actionUUID).signerResponses[messageSignaturePayload.signingAddr] != SignerResponse.approved:
                    "This address has already signed."
            }
            let action = self.borrowAction(actionUUID:actionUUID)

            // Validate Message
            assert(
                MyMultiSigV4.approveOrRejectActionMessageIsValid(action: action, messageSignaturePayload: messageSignaturePayload),
                message: "Signed message is invalid"
            )
        
            // Validate Signature
            let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
                address: messageSignaturePayload.signingAddr,
                message: String.encodeHex(messageSignaturePayload.message.utf8),
                keyIndices: messageSignaturePayload.keyIds,
                signatures: messageSignaturePayload.signatures
            )

            assert(signatureValidationResponse == true, message: "Invalid Signatures")

            // Approve action
            action.setSignerResponse(signer: messageSignaturePayload.signingAddr, value: SignerResponse.approved)
        }

        access(account) fun signerRejectAction(actionUUID: UInt64, messageSignaturePayload: MessageSignaturePayload) {
            pre {
                self.signers[messageSignaturePayload.signingAddr] == true:
                    "This address is not a signer on the Treasury." 
                self.actions[actionUUID] != nil: "Couldn't find action with UUID ".concat(actionUUID.toString())
                self.borrowAction(actionUUID: actionUUID).signerResponses[messageSignaturePayload.signingAddr] != SignerResponse.rejected:
                    "Signer "
                        .concat(messageSignaturePayload.signingAddr.toString())
                        .concat(" has already rejected this action")
            }

            // Validate Message
            assert(
                MyMultiSigV4.approveOrRejectActionMessageIsValid(action: self.borrowAction(actionUUID: actionUUID), messageSignaturePayload: messageSignaturePayload),
                message: "Signed message is invalid"
            )
        
            // Validate Signature
            let signatureValidationResponse = FCLCrypto.verifyUserSignatures(
                address: messageSignaturePayload.signingAddr,
                message: String.encodeHex(messageSignaturePayload.message.utf8),
                keyIndices: messageSignaturePayload.keyIds,
                signatures: messageSignaturePayload.signatures
            )

            assert(signatureValidationResponse == true, message: "Invalid Signatures")

            // Reject action
            let action = self.borrowAction(actionUUID: actionUUID)
            action.setSignerResponse(signer: messageSignaturePayload.signingAddr, value: SignerResponse.rejected)
        }

        pub fun canDestroyAction(actionUUID: UInt64): Bool {
            return self.getTotalRejectedForAction(actionUUID: actionUUID) > (self.signers.length - Int(self.threshold))
        }

        access(account) fun attemptDestroyAction(actionUUID: UInt64) {
            pre {
                self.canDestroyAction(actionUUID: actionUUID):
                    "Action does not have enough rejections to destroy"
            } 
            let removedAction <- self.actions.remove(key: actionUUID)
            destroy removedAction
        }

        pub fun readyToExecute(actionUUID: UInt64): Bool {
            let actionRef: &MultiSignAction = (&self.actions[actionUUID] as &MultiSignAction?)!
            return self.getTotalApprovedForAction(actionUUID: actionUUID) >= Int(self.threshold)
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

        pub fun getThreshold(): UInt {
            return self.threshold
        }

        pub fun getSignerResponsesForAction(actionUUID: UInt64): {Address: UInt} {
            let allResponses: {Address: UInt} = {}
            let responses = self.borrowAction(actionUUID: actionUUID).signerResponses
            for signer in self.signers.keys {
                if responses[signer] != nil {
                    allResponses[signer] = responses[signer]!.rawValue
                }
                else {
                    allResponses[signer] = SignerResponse.pending.rawValue
                }
            }
            return  allResponses
        }

        pub fun getTotalApprovedForAction(actionUUID: UInt64): Int {
            var total: Int = 0
            let action = self.borrowAction(actionUUID: actionUUID)
            for key in action.signerResponses.keys {
                let status = action.signerResponses[key]
                if status != nil && status! == SignerResponse.approved {
                    total = total + 1
                }
            }
            return total
        }

        pub fun getTotalRejectedForAction(actionUUID: UInt64): Int {
            var total: Int = 0
            let action = self.borrowAction(actionUUID: actionUUID)
            for key in action.signerResponses.keys {
                let status = action.signerResponses[key]
                if status != nil && status! == SignerResponse.rejected {
                    total = total + 1
                }
            }
            return total
        }

        init(initialSigners: [Address], initialThreshold: UInt) {

            pre {
                initialSigners.length >= Int(initialThreshold):
                    "Number of signers must be equal or higher than the threshold."
            }

            for signer in initialSigners {
                // Checks if the signer exists, get account key will fail otherwise
                getAccount(signer).keys.get(keyIndex: 0)
            }

            self.signers = {}
            self.actions <- {}
            self.threshold = initialThreshold

            for signer in initialSigners {
                self.signers.insert(key: signer, true)
            }
        }

        destroy() {
            destroy self.actions
        }
    }

    // Validate the approve/reject approval message
    pub fun approveOrRejectActionMessageIsValid(action: &MultiSignAction, messageSignaturePayload: MessageSignaturePayload): Bool {
        let signingBlock = getBlock(at: messageSignaturePayload.signatureBlock)!
        assert(signingBlock != nil, message: "Invalid blockId specified for signature block")
        let blockId = signingBlock.id
        let blockIds: [UInt8] = []
        
        for id in blockId {
            blockIds.append(id)
        }

        // message: {uuid of this resource}{intent}{blockId}
        let uuidString = action.uuid.toString()
        let intentHex = String.encodeHex(action.action.intent.utf8)
        let blockIdHexStr: String = String.encodeHex(blockIds)

        // Matches the `uuid` of this resource
        let message = messageSignaturePayload.message
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

    // takes a blockheight included in the signaturePayload and validates that
    // it matches the blockId encoded in the message.
    pub fun validateMessageBlockId(blockHeight: UInt64, messageBlockId: String) {
        var counter = 0
        let signingBlock = getBlock(at: blockHeight)!
        let blockId = signingBlock.id
        let blockIds: [UInt8] = []

        while (counter < blockId.length) {
            blockIds.append(blockId[counter])
            counter = counter + 1
        }

        let blockIdHex = String.encodeHex(blockIds)
        assert(
            blockIdHex == messageBlockId,
            message: "Invalid Message: invalid blockId"
        )
    }
        
    pub fun createMultiSigManager(signers: [Address], threshold: UInt): @Manager {
        return <- create Manager(initialSigners: signers, initialThreshold: threshold)
    }
}
 