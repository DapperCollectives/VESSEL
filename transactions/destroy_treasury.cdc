import DAOTreasury from "../contracts/DAOTreasury.cdc"

transaction() {
  
  prepare(signer: AuthAccount) {
    let treasury <- signer.load<@DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
    destroy treasury
  }
  execute {

  }
}