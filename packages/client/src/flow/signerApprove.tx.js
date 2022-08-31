export const SIGNER_APPROVE = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import MyMultiSigV3 from 0xMyMultiSigV3

	transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		var isValid: Bool
		let action: &MyMultiSigV3.MultiSignAction 
		let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
		let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
	  
		prepare(signer: AuthAccount) {
		  self.isValid = false
		  self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
						  .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
						  ?? panic("A DAOTreasuryV3 doesn't exist here.")
	  
		  let manager = self.treasury.borrowManagerPublic()
		  self.action = manager.borrowAction(actionUUID: actionUUID)
	  
		  var _keyIds: [Int] = []
	  
		  for keyId in keyIds {
			_keyIds.append(Int(keyId))
		  }
	  
		  self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
			  signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		  )
		}
		
		execute {
		  self.treasury.signerApproveAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
		}
	  
		post {
		  self.action.signerResponses[self.messageSignaturePayload.signingAddr] == MyMultiSigV3.SignerResponse.approved: "Error: tx completed but signer approval not registered"
		}
	  }
`;
