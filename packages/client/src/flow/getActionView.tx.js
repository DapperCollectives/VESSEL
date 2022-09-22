export const GET_ACTION_VIEW = `
  import DAOTreasuryV4 from 0xDAOTreasuryV4
  import MyMultiSigV4 from 0xMyMultiSigV4

  pub fun main(treasuryAddr: Address, actionUUID: UInt64): MyMultiSigV4.ActionView {
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                      .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                      ?? panic("A DAOTreasuryV4 doesn't exist here.")

    let manager = treasury.borrowManagerPublic()
    let action = manager.borrowAction(actionUUID: actionUUID)
    return action.getView()
  }
`;
