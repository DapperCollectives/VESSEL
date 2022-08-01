export const SIGNER_APPROVE = `
	import DAOTreasury from 0xDAOTreasury
	import MyMultiSig from 0xMyMultiSig

	transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

		var isValid: Bool
		let action: &MyMultiSig.MultiSignAction 
		let messageSignaturePayload: MyMultiSig.MessageSignaturePayload
	  
		prepare(signer: AuthAccount) {
		  self.isValid = false
		  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
						  .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
						  ?? panic("A DAOTreasury doesn't exist here.")
	  
		  let manager = treasury.borrowManagerPublic()
		  self.action = manager.borrowAction(actionUUID: actionUUID)
	  
		  var _keyIds: [Int] = []
	  
		  for keyId in keyIds {
			_keyIds.append(Int(keyId))
		  }
	  
		  self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
			signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		  )
		}
		
		execute {
		  self.isValid = self.action.signerApproveAction(messageSignaturePayload: self.messageSignaturePayload)
		}
	  
		post {
		  self.isValid == true: "Unable to revoke approval: invalid message or signature"
		  self.action.accountsVerified[self.messageSignaturePayload.signingAddr] == true: "Error: tx completed but signer approval not revoked"
		}
	  }
`;
