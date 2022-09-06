export const SIGNER_APPROVE = `
	import DAOTreasuryV4 from 0xDAOTreasuryV4
	import MyMultiSigV4 from 0xMyMultiSigV4

	transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		var isValid: Bool
		let action: &MyMultiSigV4.MultiSignAction 
		let treasury: &DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV4.MessageSignaturePayload
	  
		prepare(signer: AuthAccount) {
		  self.isValid = false
		  self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
						  .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
						  ?? panic("A DAOTreasuryV4 doesn't exist here.")
	  
		  let manager = self.treasury.borrowManagerPublic()
		  self.action = manager.borrowAction(actionUUID: actionUUID)
	  
		  var _keyIds: [Int] = []
	  
		  for keyId in keyIds {
			_keyIds.append(Int(keyId))
		  }
	  
		  self.messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
			  signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		  )
		}
		
		execute {
		  self.treasury.signerApproveAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
		}
	  
		post {
		  self.action.signerResponses[self.messageSignaturePayload.signingAddr] == MyMultiSigV4.SignerResponse.approved: "Error: tx completed but signer approval not registered"
		}
	  }
`;
