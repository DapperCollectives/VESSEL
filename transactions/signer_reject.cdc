import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  var isValid: Bool
  var action: &MyMultiSigV2.MultiSignAction
  var manager: &MyMultiSigV2.Manager{MyMultiSigV2.ManagerPublic}
  var messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.isValid = false
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

    self.manager = treasury.borrowManagerPublic()
    self.action = self.manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    for keyId in keyIds {
      _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )

  }
  execute {
    self.manager.signerRejectAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
  }
}