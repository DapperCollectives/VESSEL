import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

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