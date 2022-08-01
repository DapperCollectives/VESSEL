export const CHECK_TREASURY_NFT_COLLECTION = `
  import DAOTreasury from 0xDAOTreasury
  import NonFungibleToken from 0xNonFungibleToken

  pub fun main(treasuryAddr: Address, collectionId: String): [&NonFungibleToken.NFT] {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                      .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                      ?? panic("A DAOTreasury doesn't exist here.")

    let collection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: collectionId)
    let ids = collection.getIDs()
    let nftRefs: [&NonFungibleToken.NFT] = []
    for id in ids  {
      let nftRef: &NonFungibleToken.NFT = collection.borrowNFT(id: id)
      nftRefs.append(nftRef)
    }
    return nftRefs
  }
`;
