export const SEND_NFT_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ExampleNFT from 0xExampleNFT
	import DAOTreasury from 0xDAOTreasury
	import MyMultiSig from 0xMyMultiSig

	transaction(treasuryAddr: Address, withdrawID: UInt64) {

			prepare(signer: AuthAccount) {
					// borrow a reference to the signer's NFT collection
					let collectionRef = signer
							.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
							?? panic("Could not borrow a reference to the owner's collection")

					let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")

					// withdraw the NFT from the owner's collection
					let nft <- collectionRef.withdraw(withdrawID: withdrawID)
					let identifier: String = collectionRef.getType().identifier
					let treasuryCollection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: identifier)

					treasuryCollection.deposit(token: <- nft)
			}
	}
`;
