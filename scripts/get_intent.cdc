import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address, actionUUID: UInt64): String {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  let action = manager.borrowAction(actionUUID: actionUUID)
  return action.intent
}