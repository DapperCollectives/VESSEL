import DAOTreasury from "../contracts/DAOTreasury.cdc"

transaction(initialSigners: [Address], initialThreshold: UInt64) {
  
  prepare(signer: AuthAccount) {
    signer.save(<- DAOTreasury.createTreasury(initialSigners: initialSigners, initialThreshold: initialThreshold), to: DAOTreasury.TreasuryStoragePath)
    signer.link<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>(DAOTreasury.TreasuryPublicPath, target: DAOTreasury.TreasuryStoragePath)
  }
  execute {
   
  }
}