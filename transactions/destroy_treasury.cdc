import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"

transaction() {
  var treasury: @DAOTreasuryV5.Treasury

  prepare(signer: AuthAccount) {
    self.treasury <- signer.load<@DAOTreasuryV5.Treasury>(from: DAOTreasuryV5.TreasuryStoragePath)!
  }
  
  execute {
    destroy self.treasury
  }
}