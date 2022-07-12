import DAOTreasury from "../contracts/DAOTreasury.cdc"

transaction(treasuryAddr: Address, actionUUID: UInt64) {

  let Treasury: &DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}
  
  prepare(signer: AuthAccount) {
    self.Treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")        
  }
  execute {
    self.Treasury.destroyAction(actionUUID: actionUUID)
  }
}