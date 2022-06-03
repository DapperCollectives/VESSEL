import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

// Proposed ACTION: Transfer `amount` FlowToken from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, amount: UFix64) {

  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let RecipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>
  
  prepare(signer: AuthAccount) {
    self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist at the treasuryAddr")
    self.RecipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath)
  }
  execute {
    let action = TreasuryActions.TransferTokenToTreasury(_recipientTreasury: self.RecipientTreasury, _identifier: identifier, _amount: amount)
    self.Treasury.proposeAction(action: action)
  }
}