export const PROPOSE_TRANSFER = `
	import TreasuryActions from 0xTreasuryActions
	import DAOTreasury from 0xDAOTreasury
	import FungibleToken from 0xFungibleToken
	import MyMultiSig from 0xMyMultiSig

	transaction(treasuryAddr: Address, recipientAddr: Address, amount: UFix64) {

		let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
		let RecipientVault: Capability<&{FungibleToken.Receiver}>
		
		prepare(signer: AuthAccount) {
			self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")
			self.RecipientVault = getAccount(recipientAddr).getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
		}
		execute {
			let action = TreasuryActions.TransferToken(_recipientVault: self.RecipientVault, _amount: amount)
			self.Treasury.proposeAction(action: action)
		}
	}
`;
