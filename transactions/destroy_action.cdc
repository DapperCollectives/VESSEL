import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import TreasuryActionsV3 from "../contracts/TreasuryActions.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
  let action: AnyStruct{MyMultiSigV3.Action}
  let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")        
    self.action = TreasuryActionsV3.DestroyAction(actionUUID: actionUUID, proposer: signer.address)
        
    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
        signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}