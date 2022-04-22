import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer `amount` FlowToken from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

// 3.
transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64) {

  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let RecipientVault: Capability<&{FungibleToken.Receiver}>
  
  prepare(signer: AuthAccount) {
    self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
  }
  execute {
    let action = TreasuryActions.TransferToken(_recipientVault: self.RecipientVault, _amount: amount)
    self.Treasury.proposeAction(action: action)
  }
}