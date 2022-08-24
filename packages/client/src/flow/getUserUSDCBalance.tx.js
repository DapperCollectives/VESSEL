export const GET_USER_USDC_BALANCE = `
import FungibleToken from 0xFungibleToken
import FiatToken from 0xFiatToken

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(FiatToken.VaultBalancePubPath)
        .borrow<&FiatToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
`;
