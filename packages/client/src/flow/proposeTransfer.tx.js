export const PROPOSE_TRANSFER = `
	import TreasuryActions from 0xTreasuryActions
	import DAOTreasury from 0xDAOTreasury
	import FungibleToken from 0xFungibleToken
	import MyMultiSig from 0xMyMultiSig
	
	transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {
	
	  let treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
	  let recipientVault: Capability<&{FungibleToken.Receiver}>
	  let action: AnyStruct{MyMultiSig.Action}
	  let messageSignaturePayload: MyMultiSig.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
						.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
						?? panic("A DAOTreasury doesn't exist here.")
		self.recipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
		self.action = TreasuryActions.TransferToken(recipientVault: self.recipientVault, amount: amount, proposer: signer.address)
	
		var _keyIds: [Int] = []
	
		for keyId in keyIds {
			_keyIds.append(Int(keyId))
		}
	
		self.messageSignaturePayload = MyMultiSig.MessageSignaturePayload(
			signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		)
	  }
	  execute {
		self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
	  }
	}
`;
