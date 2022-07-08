import DAOTreasury from "../contracts/DAOTreasury.cdc"

transaction() {
  var treasury: @DAOTreasury.Treasury

  prepare(signer: AuthAccount) {
    self.treasury <- signer.load<@DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)!
  }
  
  execute {
    destroy self.treasury
  }
}