import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): [[String]] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

  let answer: [[String]] = []
  answer.append(treasury.getVaultIdentifiers())
  answer.append(treasury.getCollectionIdentifiers())
  return answer
}