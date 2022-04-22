import DAOTreasury from "../contracts/DAOTreasury.cdc"

pub fun main(treasuryAddr: Address): [[String]] {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

  let answer: [[String]] = []
  answer.append(treasury.getVaultIdentifiers())
  answer.append(treasury.getCollectionIdentifiers())
  return answer
}