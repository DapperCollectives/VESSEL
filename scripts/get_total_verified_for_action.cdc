import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address, actionUUID: UInt64): UInt64 {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  return treasury.borrowManagerPublic().getTotalVerifiedForAction(actionUUID: actionUUID)
}