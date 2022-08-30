export const GetAccountBalanceByContractName = (contractName) => `
    import ${contractName} from 0x${contractName}
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address, vaultPath: Path): UFix64 {
        let account = getAccount(address)

        //this might break for contracts with configurable vault path
        let vaultRef = account.getCapability(vaultPath)!
            .borrow<&${contractName}.Vault{FungibleToken.Balance}>()
            ?? panic("Could not borrow Balance reference to the Vault")

        return vaultRef.balance
    }`;
