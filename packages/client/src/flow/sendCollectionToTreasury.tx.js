export const SEND_COLLECTION_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ExampleNFT from 0xExampleNFT
	import DAOTreasury from 0xDAOTreasury
	import MyMultiSig from 0xMyMultiSig

	transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		prepare(signer: AuthAccount) {
	
			// borrow a reference to the signer's NFT collection
			let collectionRef = signer
				.borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
				?? panic("Could not borrow a reference to the owner's collection")
	
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
						.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
						?? panic("A DAOTreasury doesn't exist here.")
	
			let collection <- ExampleNFT.createEmptyCollection()
	
			var _keyIds: [Int] = []
	
			for keyId in keyIds {
				_keyIds.append(Int(keyId))
			}
	
			let messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
				signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
			)
			// Deposit the NFT in the treasury's collection
			treasury.signerDepositCollection(collection: <-collection, signaturePayload: messageSignaturePayload)
		}
	}
`;
