import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ExampleNFT with ID `id` from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

transaction(treasuryAddr: Address, recipientAddr: Address, identifier: String, id: UInt64) {

  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let RecipientTreasury: Capability<&{DAOTreasury.TreasuryPublic}>
  
  prepare(signer: AuthAccount) {
    self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.RecipientTreasury = getAccount(recipientAddr).getCapability<&{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath)
  }
  execute {
    let action = TreasuryActions.TransferNFTToTreasury(_recipientTreasury: self.RecipientTreasury, _identifier: identifier, _nftID: id)
    self.Treasury.proposeAction(action: action)
  }
}