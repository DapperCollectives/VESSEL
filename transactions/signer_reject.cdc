import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV4 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  var isValid: Bool
  var action: &MyMultiSigV4.MultiSignAction
  var treasury: &DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}
  var messageSignaturePayload: MyMultiSigV4.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.isValid = false
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

    let manager = self.treasury.borrowManagerPublic()
    self.action = manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    for keyId in keyIds {
      _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )

  }
  execute {
    self.treasury.signerRejectAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
  }
}