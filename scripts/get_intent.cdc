import DAOTreasury from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address, actionUUID: UInt64): String {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  let action = manager.borrowAction(actionUUID: actionUUID)
  return action.intent
}