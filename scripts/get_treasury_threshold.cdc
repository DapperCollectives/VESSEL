import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): UInt64 {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

  return UInt64(treasury.borrowManagerPublic().getThreshold())
}