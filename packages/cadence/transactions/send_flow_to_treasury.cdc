import DAOTreasury from "../contracts/DAOTreasury.cdc"
import FungibleToken from "../contracts/core/FungibleToken.cdc"

// 5.
transaction(treasuryAddr: Address, amount: UFix64) {
  
  prepare(signer: AuthAccount) {
    let vault = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)!
    let tokens <- vault.withdraw(amount: amount)
    let treasuryAcct = getAccount(treasuryAddr)
    let pubCapability = treasuryAcct.getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

    
    pubCapability.depositVault(vault: <- tokens)
  }
}