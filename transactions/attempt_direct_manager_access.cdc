import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"

transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasuryV3.Treasury>(from: DAOTreasuryV3.TreasuryStoragePath)

    // Attempt to bypass multi-sign and unilaterally update the signature threshold
    treasury?.multiSignManager?.updateThreshold(newThreshold: 100)

    signer.save(<-treasury, to: DAOTreasuryV3.TreasuryStoragePath)
  }
  execute {
    
  }
}