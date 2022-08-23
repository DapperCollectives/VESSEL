export const ADD_COLLECTION = (contractName, contractAddress) => `
	import NonFungibleToken from 0xNonFungibleToken
    import ${contractName} from ${contractAddress}
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import MyMultiSigV3 from 0xMyMultiSigV3

	transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload

		prepare(signer: AuthAccount) {
			
			self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
						.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
						?? panic("A DAOTreasuryV3 doesn't exist here.")
	
			var _keyIds: [Int] = []
	
			for keyId in keyIds {
				_keyIds.append(Int(keyId))
			}
	
			self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
				signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
			)
		}
		
		execute {
			let collection <- ${contractName}.createEmptyCollection()
			self.treasury.signerDepositCollection(collection: <- collection, signaturePayload: self.messageSignaturePayload)
		}
	}
`;