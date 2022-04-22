import DAOTreasury from "../DAOTreasury.cdc"

// 4.
transaction(treasuryAddr: Address, actionUUID: UInt64) {
  
  prepare(signer: AuthAccount) {
    let treasury = signer.borrow<&DAOTreasury.Treasury>(from: DAOTreasury.TreasuryStoragePath)
                      ?? panic("A DAOTreasury doesn't exist here.")

  let vault = treasury.borrowVault(identifier: "")
  let thing <- vault.withdraw(amount: 30.0)
  destroy thing
  }
  execute {
    
  }
}