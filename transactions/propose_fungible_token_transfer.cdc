import TreasuryActionsV5 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSigV5 from "../contracts/MyMultiSig.cdc"

	transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64, publicReceiverPath: PublicPath) {
	
	  let treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
	  let recipientVault: Capability<&{FungibleToken.Receiver}>
	  let action: AnyStruct{MyMultiSigV5.Action}
	  let messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						?? panic("A DAOTreasuryV5 doesn't exist here.")
		self.recipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(publicReceiverPath)
		self.action = TreasuryActionsV5.TransferToken(recipientVault: self.recipientVault, amount: amount, proposer: signer.address)
	
		var _keyIds: [Int] = []
	
		for keyId in keyIds {
			_keyIds.append(Int(keyId))
		}
	
		self.messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
			signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		)
	  }
	  execute {
		self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
	  }
	}