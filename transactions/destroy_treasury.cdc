import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"

transaction() {
  var treasury: @DAOTreasuryV4.Treasury

  prepare(signer: AuthAccount) {
    self.treasury <- signer.load<@DAOTreasuryV4.Treasury>(from: DAOTreasuryV4.TreasuryStoragePath)!
  }
  
  execute {
    destroy self.treasury
  }
}