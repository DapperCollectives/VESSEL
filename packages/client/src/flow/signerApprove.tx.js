export const SIGNER_APPROVE = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import MyMultiSigV5 from 0xMyMultiSigV5

	transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		var isValid: Bool
		let action: &MyMultiSigV5.MultiSignAction 
		let treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload
	  
		prepare(signer: AuthAccount) {
		  self.isValid = false
		  self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						  .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						  ?? panic("A DAOTreasuryV5 doesn't exist here.")
	  
		  let manager = self.treasury.borrowManagerPublic()
		  self.action = manager.borrowAction(actionUUID: actionUUID)
	  
		  var _keyIds: [Int] = []
	  
		  for keyId in keyIds {
			_keyIds.append(Int(keyId))
		  }
	  
		  self.messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
			  signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		  )
		}
		
		execute {
		  self.treasury.signerApproveAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
		}
	  
		post {
		  self.action.signerResponses[self.messageSignaturePayload.signingAddr] == MyMultiSigV5.SignerResponse.approved: "Error: tx completed but signer approval not registered"
		}
	  }
`;
