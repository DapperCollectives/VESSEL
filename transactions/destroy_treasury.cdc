import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"

transaction() {
  var treasury: @DAOTreasuryV2.Treasury

  prepare(signer: AuthAccount) {
    self.treasury <- signer.load<@DAOTreasuryV2.Treasury>(from: DAOTreasuryV2.TreasuryStoragePath)!
  }
  
  execute {
    destroy self.treasury
  }
}