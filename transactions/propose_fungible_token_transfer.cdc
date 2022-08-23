import TreasuryActionsV3 from "../contracts/TreasuryActions.cdc"
import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

	transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64, publicReceiverPath: PublicPath) {
	
	  let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
	  let recipientVault: Capability<&{FungibleToken.Receiver}>
	  let action: AnyStruct{MyMultiSigV3.Action}
	  let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
	  
	  prepare(signer: AuthAccount) {
		self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
						.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
						?? panic("A DAOTreasuryV3 doesn't exist here.")
		self.recipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(publicReceiverPath)
		self.action = TreasuryActionsV3.TransferToken(recipientVault: self.recipientVault, amount: amount, proposer: signer.address)
	
		var _keyIds: [Int] = []
	
		for keyId in keyIds {
			_keyIds.append(Int(keyId))
		}
	
		self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
			signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
		)
	  }
	  execute {
		self.treasury.proposeAction(action: self.action, signaturePayload: self.messageSignaturePayload)
	  }
	}