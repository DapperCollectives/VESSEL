import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import FlowToken from "../contracts/core/FlowToken.cdc"
import FiatToken from "../contracts/core/FiatToken.cdc"
import FUSD from "../contracts/core/FUSD.cdc"

transaction(initialSigners: [Address], initialThreshold: UInt) {
  
  prepare(signer: AuthAccount) {
    let treasury <- DAOTreasuryV5.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)

    // Seed Treasury with commonly used vaults
    let flowVault <- FlowToken.createEmptyVault()
    let usdcVault <- FiatToken.createEmptyVault()
    let fusdVault <- FUSD.createEmptyVault()

    treasury.depositVault(vault: <- flowVault)
    treasury.depositVault(vault: <- usdcVault)
    treasury.depositVault(vault: <- fusdVault)

    // Save Treasury to the account
    signer.save(<- treasury, to: DAOTreasuryV5.TreasuryStoragePath)
    signer.link<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>(DAOTreasuryV5.TreasuryPublicPath, target: DAOTreasuryV5.TreasuryStoragePath)
  }
}