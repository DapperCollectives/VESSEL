import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, messageHex: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  var isValid: Bool
  let action: &MyMultiSigV2.MultiSignAction 
  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    self.isValid = false
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

    let manager = treasury.borrowManagerPublic()
    self.action = manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    for keyId in keyIds {
      _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        signingAddr: signer.address, message: message, messageHex: messageHex, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  
  execute {
    self.isValid = self.action.signerApproveAction(messageSignaturePayload: self.messageSignaturePayload)
  }

  post {
    self.isValid == true: "Unable to revoke approval: invalid message or signature"
    self.action.accountsVerified[self.messageSignaturePayload.signingAddr] == true: "Error: tx completed but signer approval not revoked"
  }
}