import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): {UInt64: String} {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

  return treasury.borrowManagerPublic().getIntents()
}