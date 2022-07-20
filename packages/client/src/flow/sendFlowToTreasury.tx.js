export const SEND_FLOW_TO_TREASURY = `
	import DAOTreasury from 0xDAOTreasury
	import FungibleToken from 0xFungibleToken

	transaction(treasuryAddr: Address, amount: UFix64) {
  
		prepare(signer: AuthAccount) {
			
			let vault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)!
			let tokens <- vault.withdraw(amount: amount)
		
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
						.borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
						?? panic("A DAOTreasury doesn't exist here.")
		
			let identifier: String = vault.getType().identifier
		
			treasury.depositTokens(identifier: identifier, vault: <- tokens)
		}
	}
`;
