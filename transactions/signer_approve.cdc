import DAOTreasury from "../contracts/DAOTreasury.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  let action: &MyMultiSig.MultiSignAction 
  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

    let manager = treasury.borrowManagerPublic()
    self.action = manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    var j = 0
    for keyId in keyIds {
      _keyIds.append(Int(keyId))
      j = j + 1
    }

    self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
      _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
    )

  }
  execute {
    var isValid = self.action.signerApproveAction(_messageSignaturePayload: self.messageSignaturePayload)
  }
}