import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): [[String]] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

  let answer: [[String]] = []
  answer.append(treasury.getVaultIdentifiers())
  answer.append(treasury.getCollectionIdentifiers())
  return answer
}