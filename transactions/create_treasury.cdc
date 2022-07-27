import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FlowToken from "../contracts/core/FlowToken.cdc"
import FiatToken from "../contracts/core/FiatToken.cdc"

transaction(initialSigners: [Address], initialThreshold: UInt64) {
  
  prepare(signer: AuthAccount) {
    let treasury <- DAOTreasury.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold)

    // Seed Treasury with commonly used vaults
    let flowVault <- FlowToken.createEmptyVault()
    let usdcVault <- FiatToken.createEmptyVault()

    treasury.depositVault(vault: <- flowVault)
    treasury.depositVault(vault: <- usdcVault)

    // Save Treasury to the account
    signer.save(<- treasury, to: DAOTreasury.TreasuryStoragePath)
    signer.link<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath, target: DAOTreasury.TreasuryStoragePath)
  }
}