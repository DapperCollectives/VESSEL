

// This script reads the balance field of an account's FiatToken Balance
// copied over from https://github.com/flow-usdc/flow-usdc/blob/main/scripts/vault/get_balance.cdc

import FungibleToken from "../contracts/core/FungibleToken.cdc"
import FiatToken from "../contracts/core/FiatToken.cdc"

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(FiatToken.VaultBalancePubPath)
        .borrow<&FiatToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}