export const ADD_COLLECTION = (contractName, contractAddress) => `
	import NonFungibleToken from 0xNonFungibleToken
    import ${contractName} from ${contractAddress}
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import MyMultiSigV5 from 0xMyMultiSigV5

	transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		let treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload

		prepare(signer: AuthAccount) {
			
			self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						?? panic("A DAOTreasuryV5 doesn't exist here.")
	
			var _keyIds: [Int] = []
	
			for keyId in keyIds {
				_keyIds.append(Int(keyId))
			}
	
			self.messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
				signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
			)
		}
		
		execute {
			let collection <- ${contractName}.createEmptyCollection()
			self.treasury.signerDepositCollection(collection: <- collection, signaturePayload: self.messageSignaturePayload)
		}
	}
`;
