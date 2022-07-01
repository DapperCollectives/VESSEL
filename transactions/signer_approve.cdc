import DAOTreasury from "../contracts/DAOTreasury.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

// 4.
transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
  prepare(signer: AuthAccount) {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

    let manager = treasury.borrowManagerPublic()
    let action = manager.borrowAction(actionUUID: actionUUID)

    var _keyIds: [Int] = []

    var j = 0
    for keyId in keyIds {
      _keyIds.append(Int(keyId))
      j = j + 1
    }

    let messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
      _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
    )

    var isValid = action.signerApproveAction(_messageSignaturePayload: messageSignaturePayload)
  }
  execute {
    
  }
}