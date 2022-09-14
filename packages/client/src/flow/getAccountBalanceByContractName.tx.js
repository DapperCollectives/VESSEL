export const GetAccountBalanceByContractName = (contractName) => `
    import ${contractName} from 0x${contractName}
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address, vaultPath: PublicPath): UFix64 {
        let account = getAccount(address)

        //this might break for contracts with configurable vault path
        let vaultCap = getAccount(address).getCapability<&${contractName}.Vault{FungibleToken.Balance}>(vaultPath)
        if vaultCap.check() {
            let vaultRef: &${contractName}.Vault{FungibleToken.Balance} = vaultCap.borrow()??panic("Could not borrow Balance reference to the Vault")
            return vaultRef.balance
        } else{
            return 0.00
        }
    }`;
