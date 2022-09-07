import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

  let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
  return vault.balance
}