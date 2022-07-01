import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FlowToken from "../contracts/core/FlowToken.cdc"
import FUSD from "../contracts/core/FUSD.cdc"

// 1.
transaction(initialSigners: [Address], initialThreshold: UInt64) {
  
  prepare(signer: AuthAccount) {
    let treasury <- DAOTreasury.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)

    // Seed Treasury with commonly used vaults
    let flowVault <- FlowToken.createEmptyVault()
    let fusdVault <- FUSD.createEmptyVault()

    treasury.depositVault(vault: <- flowVault)
    treasury.depositVault(vault: <- fusdVault)

    // Save Treasury to the account
    signer.save(<- treasury, to: DAOTreasury.TreasuryStoragePath)
    signer.link<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath, target: DAOTreasury.TreasuryStoragePath)
  }
  execute {
   
  }
}