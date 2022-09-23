export const SEND_NFT_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ZeedzINO from 0xZeedzINO
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import MyMultiSigV5 from 0xMyMultiSigV5

	transaction(treasuryAddr: Address, withdrawID: UInt64) {

			prepare(signer: AuthAccount) {
					// borrow a reference to the signer's NFT collection
					let collectionRef = signer
							.borrow<&ZeedzINO.Collection>(from: ZeedzINO.CollectionStoragePath)
							?? panic("Could not borrow a reference to the owner's collection")

					let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
											.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
											?? panic("A DAOTreasuryV5 doesn't exist here.")

					// withdraw the NFT from the owner's collection
					let nft <- collectionRef.withdraw(withdrawID: withdrawID)
					let identifier: String = collectionRef.getType().identifier
					
					treasury.depositNFT(identifier: identifier, nft: <- nft)
			}
	}
`;
