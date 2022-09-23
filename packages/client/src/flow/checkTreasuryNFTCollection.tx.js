export const CHECK_TREASURY_NFT_COLLECTION = `
  import DAOTreasuryV5 from 0xDAOTreasuryV5
  import NonFungibleToken from 0xNonFungibleToken

  pub fun main(treasuryAddr: Address, collectionId: String): [&NonFungibleToken.NFT] {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV5 doesn't exist here.")

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
