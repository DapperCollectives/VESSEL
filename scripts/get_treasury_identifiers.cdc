import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): [[String]] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

  let answer: [[String]] = []
  answer.append(treasury.getVaultIdentifiers())
  answer.append(treasury.getCollectionIdentifiers())
  return answer
}