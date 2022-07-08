import DAOTreasury from "../contracts/DAOTreasury.cdc"

// 4.
transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)

    // Attempt to bypass multi-sign and unilaterally update the signature threshold
    treasury?.multiSignManager?.updateThreshold(newThreshold: 100)

    signer.save(<-treasury, to: DAOTreasury.TreasuryStoragePath)
  }
  execute {
    
  }
}