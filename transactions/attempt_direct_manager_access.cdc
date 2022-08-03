import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"

transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasuryV2.Treasury>(from: DAOTreasuryV2.TreasuryStoragePath)

    // Attempt to bypass multi-sign and unilaterally update the signature threshold
    treasury?.multiSignManager?.updateThreshold(newThreshold: 100)

    signer.save(<-treasury, to: DAOTreasuryV2.TreasuryStoragePath)
  }
  execute {
    
  }
}