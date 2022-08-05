export const GET_USER_FUSD_BALANCE = `
    import FUSD from 0xFUSD
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
        let vaultRef = account.getCapability(/public/fusdBalance)!
            .borrow<&FUSD.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

        return vaultRef.balance
    }`;
