export const SEND_FLOW_TO_TREASURY = `
	import DAOTreasury from 0xDAOTreasury
	import FungibleToken from 0xFungibleToken

	transaction(treasuryAddr: Address, amount: UFix64) {
		
		prepare(signer: AuthAccount) {
			let vault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)!
			let tokens <- vault.withdraw(amount: amount)
			let treasuryAcct = getAccount(treasuryAddr)
			let pubCapability = treasuryAcct.getCapability(DAOTreasury.TreasuryPublicPath)
											.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
											?? panic("A DAOTreasury doesn't exist here.")

			
			pubCapability.depositVault(vault: <- tokens)
		}
	}
`;
