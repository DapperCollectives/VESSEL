import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"

transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasuryV4.Treasury>(from: DAOTreasuryV4.TreasuryStoragePath)

    // Attempt to bypass multi-sign and unilaterally update the signature threshold
    treasury?.multiSignManager?.updateThreshold(newThreshold: 100)

    signer.save(<-treasury, to: DAOTreasuryV4.TreasuryStoragePath)
  }
  execute {
    
  }
}