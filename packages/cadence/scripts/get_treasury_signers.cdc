import DAOTreasury from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): {Address: Bool} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

  return treasury.borrowManagerPublic().getSigners()
}