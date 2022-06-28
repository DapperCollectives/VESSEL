import TreasuryActions from "../contracts/TreasuryActions.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"

// An example of proposing an action.
//
// Proposed ACTION: Transfer ExampleNFT with ID `id` from the DAOTreasury
// at `treasuryAddr` to `recipientAddr`

// 3.
transaction(treasuryAddr: Address, recipientAddr: Address, id: UInt64) {

  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  let RecipientCollection: Capability<&{NonFungibleToken.CollectionPublic}>
  
  prepare(signer: AuthAccount) {
    self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")
    self.RecipientCollection = getAccount(recipientAddr).getCapability<&{NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
  }
  execute {
    let action = TreasuryActions.TransferNFT(_recipientCollection: self.RecipientCollection, _nftID: id)
    self.Treasury.proposeAction(action: action)
  }
}