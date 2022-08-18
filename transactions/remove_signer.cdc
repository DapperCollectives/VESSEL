import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import TreasuryActionsV2 from "../contracts/TreasuryActions.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, signerToBeRemoved: Address, message: String, messageHex: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
  
  let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
  let action: AnyStruct{MyMultiSigV2.Action}
  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload

  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")
    self.action = TreasuryActionsV2.RemoveSigner(signer: signerToBeRemoved, proposer: signer.address)
    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        signingAddr: signer.address, message: message, messageHex: messageHex, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}