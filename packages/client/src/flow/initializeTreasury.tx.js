export const INITIALIZE_TREASURY = `
	import DAOTreasuryV2 from 0xDAOTreasuryV2
	import FlowToken from 0xFlowToken

	transaction(initialSigners: [Address], initialThreshold: UInt64) {
  
		prepare(signer: AuthAccount) {
		  let treasury <- DAOTreasuryV2.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	  
		  // Seed Treasury with commonly used vaults
		  let flowVault <- FlowToken.createEmptyVault()
	  
		  treasury.depositVault(vault: <- flowVault)
	  
		  // Save Treasury to the account
		  signer.save(<- treasury, to: DAOTreasuryV2.TreasuryStoragePath)
		  signer.link<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>(DAOTreasuryV2.TreasuryPublicPath, target: DAOTreasuryV2.TreasuryStoragePath)
		}
	  }
`;
