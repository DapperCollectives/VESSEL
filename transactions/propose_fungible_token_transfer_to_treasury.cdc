import TreasuryActionsV2 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

// Proposed ACTION: Transfer `amount` FlowToken from the DAOTreasuryV2
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasuryV2.TreasuryPublic}>
  let action: AnyStruct{MyMultiSigV2.Action}
  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist at the treasuryAddr")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasuryV2.TreasuryPublic}>(DAOTreasuryV2.TreasuryPublicPath)
    self.action = TreasuryActionsV2.TransferTokenToTreasury(_recipientTreasury: self.recipientTreasury, _identifier: identifier, _amount: amount, _proposer: signer.address)

    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
        _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}