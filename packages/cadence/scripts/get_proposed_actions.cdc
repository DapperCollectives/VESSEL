import DAOTreasury from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): {UInt64: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

  return treasury.borrowManagerPublic().getIntents()
}