export const SEND_TOKENS_TO_TREASURY = `
	import DAOTreasuryV5 from 0xDAOTreasuryV5
	import FungibleToken from 0xFungibleToken

	transaction(treasuryAddr: Address, amount: UFix64, vaultPath: StoragePath ) {
  
		prepare(signer: AuthAccount) {
		  
			let vault = signer.borrow<&FungibleToken.Vault>(from: vaultPath)!
			let tokens <- vault.withdraw(amount: amount)
		
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						?? panic("A DAOTreasuryV5 doesn't exist here.")
		
			let identifier: String = vault.getType().identifier
	  
			treasury.depositTokens(identifier: identifier, vault: <- tokens)
		}
	  }
`;
