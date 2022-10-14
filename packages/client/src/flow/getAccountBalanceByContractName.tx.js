export const VAULT_EXIST_CHECK = (contractName) => `
    import ${contractName} from 0x${contractName}
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address, vaultPath: PublicPath): Bool {
        let vaultCap = getAccount(address).getCapability<&${contractName}.Vault{FungibleToken.Balance}>(vaultPath)
        return vaultCap.check() 
    }
`;

export const GET_ACCOUNT_BALANCE = (contractName) => `
    import ${contractName} from 0x${contractName}
    import FungibleToken from 0xFungibleToken

    pub fun main(address: Address, vaultPath: PublicPath): UFix64 {
        let vaultRef: &${contractName}.Vault{FungibleToken.Balance} = getAccount(address)
            .getCapability<&${contractName}.Vault{FungibleToken.Balance}>(vaultPath)
            .borrow() ?? panic("Could not borrow Balance reference to the Vault")
        return vaultRef.balance
    }
`;
