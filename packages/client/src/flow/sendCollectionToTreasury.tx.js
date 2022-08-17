export const SEND_COLLECTION_TO_TREASURY = `
	import NonFungibleToken from 0xNonFungibleToken
	import ExampleNFT from 0xExampleNFT
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import MyMultiSigV2 from 0xMyMultiSigV2

	transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		prepare(signer: AuthAccount) {
	
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
						.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
						?? panic("A DAOTreasuryV2 doesn't exist here.")
	
			let collection <- ExampleNFT.createEmptyCollection()
	
			var _keyIds: [Int] = []
	
			for keyId in keyIds {
				_keyIds.append(Int(keyId))
			}
	
			let messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
				signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
			)
			// Deposit the NFT in the treasury's collection
			treasury.signerDepositCollection(collection: <-collection, signaturePayload: messageSignaturePayload)
		}
	}
`;
