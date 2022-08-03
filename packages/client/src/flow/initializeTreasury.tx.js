export const INITIALIZE_TREASURY = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import FlowToken from 0xFlowToken
	import FiatToken from 0xFiatToken
	import FUSD from 0xFUSD
	
	transaction(initialSigners: [Address], initialThreshold: UInt64) {
	  
	  prepare(signer: AuthAccount) {
		let treasury <- DAOTreasuryV2.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	
		// Seed Treasury with commonly used vaults
		let flowVault <- FlowToken.createEmptyVault()
		let usdcVault <- FiatToken.createEmptyVault()
		let fusdVault <- FUSD.createEmptyVault()
	
		treasury.depositVault(vault: <- flowVault)
		treasury.depositVault(vault: <- usdcVault)
		treasury.depositVault(vault: <- fusdVault)
	
		// Save Treasury to the account
		signer.save(<- treasury, to: DAOTreasuryV2.TreasuryStoragePath)
		signer.link<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>(DAOTreasuryV2.TreasuryPublicPath, target: DAOTreasuryV2.TreasuryStoragePath)
	  }
	}
`;
