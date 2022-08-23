export const INITIALIZE_TREASURY = `
	import DAOTreasuryV3 from 0xDAOTreasuryV3
	import FlowToken from 0xFlowToken
	import FiatToken from 0xFiatToken
	import FUSD from 0xFUSD
	
	transaction(initialSigners: [Address], initialThreshold: UInt) {
	  
	  prepare(signer: AuthAccount) {
		let treasury <- DAOTreasuryV3.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	
		// Seed Treasury with commonly used vaults
		let flowVault <- FlowToken.createEmptyVault()
		let usdcVault <- FiatToken.createEmptyVault()
		let fusdVault <- FUSD.createEmptyVault()
	
		treasury.depositVault(vault: <- flowVault)
		treasury.depositVault(vault: <- usdcVault)
		treasury.depositVault(vault: <- fusdVault)
	
		// Save Treasury to the account
		signer.save(<- treasury, to: DAOTreasuryV3.TreasuryStoragePath)
		signer.link<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>(DAOTreasuryV3.TreasuryPublicPath, target: DAOTreasuryV3.TreasuryStoragePath)
	  }
	}
`;
