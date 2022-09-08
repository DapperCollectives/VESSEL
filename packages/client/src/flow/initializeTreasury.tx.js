export const INITIALIZE_TREASURY = `
	import DAOTreasuryV4 from 0xDAOTreasuryV4
	import FlowToken from 0xFlowToken
	import FiatToken from 0xFiatToken
	import FUSD from 0xFUSD
	
	transaction(initialSigners: [Address], initialThreshold: UInt) {
	  
	  prepare(signer: AuthAccount) {
		let treasury <- DAOTreasuryV4.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	
		// Seed Treasury with commonly used vaults
		let flowVault <- FlowToken.createEmptyVault()
		let usdcVault <- FiatToken.createEmptyVault()
		let fusdVault <- FUSD.createEmptyVault()
	
		treasury.depositVault(vault: <- flowVault)
		treasury.depositVault(vault: <- usdcVault)
		treasury.depositVault(vault: <- fusdVault)
	
		// Save Treasury to the account
		signer.save(<- treasury, to: DAOTreasuryV4.TreasuryStoragePath)
		signer.link<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>(DAOTreasuryV4.TreasuryPublicPath, target: DAOTreasuryV4.TreasuryStoragePath)
	  }
	}
`;
