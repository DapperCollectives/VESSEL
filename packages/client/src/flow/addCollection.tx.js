export const ADD_COLLECTION = (contractName, contractAddress) => `
	import NonFungibleToken from 0xNonFungibleToken
    import ${contractName} from ${contractAddress}
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import MyMultiSigV2 from 0xMyMultiSigV2

	transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload

		prepare(signer: AuthAccount) {
			
			self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
						.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
						?? panic("A DAOTreasuryV2 doesn't exist here.")
	
			var _keyIds: [Int] = []
	
			for keyId in keyIds {
				_keyIds.append(Int(keyId))
			}
	
			self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
				signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
			)
		}
		
		execute {
			let collection <- ${contractName}.createEmptyCollection()
			self.treasury.signerDepositCollection(collection: <- collection, signaturePayload: self.messageSignaturePayload)
		}
	}
`;