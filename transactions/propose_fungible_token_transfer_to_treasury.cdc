import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

// Proposed ACTION: Transfer `amount` FlowToken from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

  let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let recipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>
  let action: AnyStruct{MyMultiSig.Action}
  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload
  
  prepare(signer: AuthAccount) {
    self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist at the treasuryAddr")
    self.recipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath)
    self.action = TreasuryActions.TransferTokenToTreasury(_recipientTreasury: self.recipientTreasury, _identifier: identifier, _amount: amount, _proposer: signer.address)

    var _keyIds: [Int] = []

    for keyId in keyIds {
        _keyIds.append(Int(keyId))
    }

    self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
        _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
    )
  }
  execute {
    self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
  }
}