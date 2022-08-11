export const GET_USER_FLOW_BALANCE = `
    import FlowToken from 0xFlowToken
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
        let vaultRef = account.getCapability(/public/flowTokenBalance)!
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

        return vaultRef.balance
    }`;
