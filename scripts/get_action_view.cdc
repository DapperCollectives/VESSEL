import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV5 from "../contracts/MyMultiSig.cdc"

pub fun main(treasuryAddr: Address, actionUUID: UInt64): MyMultiSigV5.ActionView {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

  let manager = treasury.borrowManagerPublic()
  let action = manager.borrowAction(actionUUID: actionUUID)
  return action.getView()
}