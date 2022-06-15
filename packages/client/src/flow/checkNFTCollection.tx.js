export const CHECK_NFT_COLLECTION = `
	import NonFungibleToken from 0xNonFungibleToken

	// when fcl @1.0.0 is in then nft path can be an arg
  pub fun main(userAddr: Address): [UInt64] {
		let collection = getAccount(userAddr).getCapability(/public/exampleNFTCollection)
				.borrow<&{NonFungibleToken.CollectionPublic}>()
				?? panic("Could not borrow a reference to the receiver's collection")

		let ids = collection.getIDs()

    return ids
  }
`;
