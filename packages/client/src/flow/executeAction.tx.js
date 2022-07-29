export const EXECUTE_ACTION = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import MyMultiSigV2 from 0xMyMultiSigV2

	transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

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
			  _signingAddr: signer.address, _message: message, _keyIds: _keyIds, _signatures: signatures, _signatureBlock: signatureBlock
		  )
		}
		execute {
		  self.treasury.executeAction(actionUUID: actionUUID, signaturePayload: self.messageSignaturePayload)
		}
	  }
`;
