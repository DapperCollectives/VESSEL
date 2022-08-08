export const PROPOSE_TRANSFER = `
	import TreasuryActionsV2 from 0xTreasuryActionsV2
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import FungibleToken from 0xFungibleToken
	import MyMultiSigV2 from 0xMyMultiSigV2
	
	transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64, publicReceiverPath: PublicPath, coinType: String) {
	
	  let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
	  let recipientVault: Capability<&{FungibleToken.Receiver}>
	  let action: AnyStruct{MyMultiSigV2.Action}
	  let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
						.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
						?? panic("A DAOTreasuryV2 doesn't exist here.")
		self.recipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(publicReceiverPath)
		self.action = TreasuryActionsV2.TransferToken(recipientVault: self.recipientVault, amount: amount, proposer: signer.address, coinType: coinType)
	
		var _keyIds: [Int] = []
	
		for keyId in keyIds {
			_keyIds.append(Int(keyId))
		}
	
		self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
			signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		)
	  }
	  execute {
		log("------------------action intent---------------------")
		log(self.action)
		log("------------------message---------------------")
		log(self.messageSignaturePayload)
		//self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
	  }
	}
`;
