import DAOTreasury from "../DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

// 5.
transaction(treasuryAddr: Address, amount: UFix64) {
  
  prepare(signer: AuthAccount) {
    let vault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)!
    let tokens <- vault.withdraw(amount: amount)
    let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

    
    treasury.depositVault(vault: <- tokens)
  }
  execute {

  }
}