import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): {UInt64: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  return treasury.borrowManagerPublic().getIntents()
}