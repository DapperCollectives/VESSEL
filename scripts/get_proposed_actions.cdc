import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): {UInt64: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

  return treasury.borrowManagerPublic().getIntents()
}