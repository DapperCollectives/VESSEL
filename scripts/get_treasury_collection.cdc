import DAOTreasury from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"

pub fun main(treasuryAddr: Address, collectionId: String): [UInt64] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

  // let identifier: String = "A.7e60df042a9c0868.ExampleNFT.Collection"
  let collection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: collectionId)
  return collection.getIDs()
}