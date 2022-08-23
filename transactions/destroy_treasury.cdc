import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"

transaction() {
  var treasury: @DAOTreasuryV3.Treasury

  prepare(signer: AuthAccount) {
    self.treasury <- signer.load<@DAOTreasuryV3.Treasury>(from: DAOTreasuryV3.TreasuryStoragePath)!
  }
  
  execute {
    destroy self.treasury
  }
}