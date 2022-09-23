import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"

transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasuryV5.Treasury>(from: DAOTreasuryV5.TreasuryStoragePath)

    // Attempt to bypass multi-sign and unilaterally update the signature threshold
    treasury?.multiSignManager?.updateThreshold(newThreshold: 100)

    signer.save(<-treasury, to: DAOTreasuryV5.TreasuryStoragePath)
  }
  execute {
    
  }
}