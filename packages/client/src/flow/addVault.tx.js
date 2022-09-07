export const ADD_VAULT = (contractName) => `
    import DAOTreasuryV4 from 0xDAOTreasuryV4
    import ${contractName} from 0x${contractName}
    import MyMultiSigV4 from 0xMyMultiSigV4

    transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

        let treasury: &DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}
        let messageSignaturePayload: MyMultiSigV4.MessageSignaturePayload
        
        prepare(signer: AuthAccount) {
            self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                            .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                                ?? panic("A DAOTreasuryV4 doesn't exist here.")
            var _keyIds: [Int] = []
        
            for keyId in keyIds {
                _keyIds.append(Int(keyId))
            }

            self.messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
                signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
            )
        }

        execute {
            let vault <- ${contractName}.createEmptyVault()
            self.treasury.signerDepositVault(vault: <- vault, signaturePayload: self.messageSignaturePayload)
        }
    }
`;