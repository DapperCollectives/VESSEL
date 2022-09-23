import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

  let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
  return vault.balance
}