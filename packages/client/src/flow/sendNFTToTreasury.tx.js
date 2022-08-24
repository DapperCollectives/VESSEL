export const SEND_NFT_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ZeedzINO from 0xZeedzINO
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import MyMultiSigV3 from 0xMyMultiSigV3

	transaction(treasuryAddr: Address, withdrawID: UInt64) {

			prepare(signer: AuthAccount) {
					// borrow a reference to the signer's NFT collection
					let collectionRef = signer
							.borrow<&ZeedzINO.Collection>(from: ZeedzINO.CollectionStoragePath)
							?? panic("Could not borrow a reference to the owner's collection")

					let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
											.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
											?? panic("A DAOTreasuryV3 doesn't exist here.")

					// withdraw the NFT from the owner's collection
					let nft <- collectionRef.withdraw(withdrawID: withdrawID)
					let identifier: String = collectionRef.getType().identifier
					
					treasury.depositNFT(identifier: identifier, nft: <- nft)
			}
	}
`;
