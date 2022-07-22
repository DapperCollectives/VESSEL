export const INITIALIZE_TREASURY = `
	import DAOTreasury from 0xDAOTreasury
	import FlowToken from 0xFlowToken

	transaction(initialSigners: [Address], initialThreshold: UInt64) {
  
		prepare(signer: AuthAccount) {
		  let treasury <- DAOTreasury.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)
	  
		  // Seed Treasury with commonly used vaults
		  let flowVault <- FlowToken.createEmptyVault()
	  
		  treasury.depositVault(vault: <- flowVault)
	  
		  // Save Treasury to the account
		  signer.save(<- treasury, to: DAOTreasury.TreasuryStoragePath)
		  signer.link<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath, target: DAOTreasury.TreasuryStoragePath)
		}
	  }
`;
