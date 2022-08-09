export const ADD_VAULT = (contractName) => `
    import DAOTreasuryV2 from 0xDAOTreasuryV2
    import ${contractName} from 0x${contractName}

    transaction(treasuryAddr: Address) {

    let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
    
    prepare(signer: AuthAccount) {
        self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
						.borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
						?? panic("A DAOTreasuryV2 doesn't exist here.")        
        }

        execute {
            let vault <- ${contractName}.createEmptyVault()
            self.treasury.depositTokens(identifier: vault.getType().identifier, vault: <- vault)
        }
    }
`;