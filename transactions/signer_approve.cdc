import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  var isValid: Bool
  let action: &MyMultiSigV3.MultiSignAction 
  let manager: &MyMultiSigV3.Manager{MyMultiSigV3.ManagerPublic}
  let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    self.isValid = false
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

    self.manager = treasury.borrowManagerPublic()
    self.action = self.manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    for keyId in keyIds {
      _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  
  execute {
    self.manager.signerApproveAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
  }

  post {
    self.action.signerResponses[self.messageSignaturePayload.signingAddr] == MyMultiSigV3.SignerResponse.approved: "Error: tx completed but signer approval not registered"
  }
}