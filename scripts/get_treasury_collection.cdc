import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"

pub fun main(treasuryAddr: Address, collectionId: String): [&NonFungibleToken.NFT] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

  let collection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: collectionId)
  let ids = collection.getIDs()
  let nftRefs: [&NonFungibleToken.NFT] = []
  for id in ids  {
    let nftRef: &NonFungibleToken.NFT  = collection.borrowNFT(id: id)
    nftRefs.append(nftRef)
  }
  return nftRefs
}