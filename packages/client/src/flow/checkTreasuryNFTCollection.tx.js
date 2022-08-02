export const CHECK_TREASURY_NFT_COLLECTION = `
  import DAOTreasuryV2 from 0xDAOTreasuryV2
  import NonFungibleToken from 0xNonFungibleToken

  pub fun main(treasuryAddr: Address, collectionId: String): [&NonFungibleToken.NFT] {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV2 doesn't exist here.")

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
