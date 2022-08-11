import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import FlowToken from "../contracts/core/FlowToken.cdc"
import FiatToken from "../contracts/core/FiatToken.cdc"
import FUSD from "../contracts/core/FUSD.cdc"

transaction(initialSigners: [Address], initialThreshold: Int) {
  
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