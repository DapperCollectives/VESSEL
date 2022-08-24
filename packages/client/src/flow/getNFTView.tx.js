export const GET_NFT_VIEW = `
	import ZeedzINO from 0xZeedzINO
	import MetadataViews from 0xMetadataViews

	// when fcl @1.0.0 is in then nft path can be an arg
  	pub fun main(userAddr: Address, id: UInt64): AnyStruct? {
		let collection = getAccount(userAddr).getCapability(/public/ZeedzINOCollection)
				.borrow<&{ZeedzINO.ZeedzCollectionPublic}>()
				?? panic("Could not borrow a reference to the receiver's collection")

		// Get the basic display information for this NFT
		let nft = collection.borrowNFT(id: id)!
		let view = nft.resolveView(Type<MetadataViews.Display>())!
		let display = view as! MetadataViews.Display

		return display
  }
`;
