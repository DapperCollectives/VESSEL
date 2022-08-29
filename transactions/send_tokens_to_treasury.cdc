import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

transaction(treasuryAddr: Address, amount: UFix64, vaultPath: StoragePath ) {
  
		prepare(signer: AuthAccount) {
		  
			let vault = signer.borrow<&FungibleToken.Vault>(from: vaultPath)!
			let tokens <- vault.withdraw(amount: amount)
		
			let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
						.borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
						?? panic("A DAOTreasuryV3 doesn't exist here.")
		
			let identifier: String = vault.getType().identifier
	  
			treasury.depositTokens(identifier: identifier, vault: <- tokens)
		}
	  }