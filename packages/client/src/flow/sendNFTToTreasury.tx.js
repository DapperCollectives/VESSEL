export const SEND_NFT_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ExampleNFT from 0xExampleNFT
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import MyMultiSigV2 from 0xMyMultiSigV2

	transaction(treasuryAddr: Address, withdrawID: UInt64) {

			prepare(signer: AuthAccount) {
					// borrow a reference to the signer's NFT collection
					let collectionRef = signer
							.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
							?? panic("Could not borrow a reference to the owner's collection")

					let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
											.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
											?? panic("A DAOTreasuryV2 doesn't exist here.")

					// withdraw the NFT from the owner's collection
					let nft <- collectionRef.withdraw(withdrawID: withdrawID)
					let identifier: String = collectionRef.getType().identifier
					
					treasury.depositNFT(identifier: identifier, nft: <- nft)
			}
	}
`;
