export const INITIALIZE_TREASURY = `
	import DAOTreasury from 0xDAOTreasury
	import FlowToken from 0xFlowToken
	import FiatToken from 0xFiatToken
	import FUSD from 0xFUSD
	
	transaction(initialSigners: [Address], initialThreshold: UInt64) {
	  
	  prepare(signer: AuthAccount) {
		let treasury <- DAOTreasury.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	
		// Seed Treasury with commonly used vaults
		let flowVault <- FlowToken.createEmptyVault()
		let usdcVault <- FiatToken.createEmptyVault()
		let fusdVault <- FUSD.createEmptyVault()
	
		treasury.depositVault(vault: <- flowVault)
		treasury.depositVault(vault: <- usdcVault)
		treasury.depositVault(vault: <- fusdVault)
	
		// Save Treasury to the account
		signer.save(<- treasury, to: DAOTreasury.TreasuryStoragePath)
		signer.link<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath, target: DAOTreasury.TreasuryStoragePath)
	  }
	}
`;
