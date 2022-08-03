import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

pub fun main(treasuryAddr: Address, vaultId: String): UFix64 {
  let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

  let vault: &{FungibleToken.Balance} = treasury.borrowVaultPublic(identifier: vaultId)
  return vault.balance
}