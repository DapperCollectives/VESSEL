export const ADD_VAULT = (contractName) => `
    import DAOTreasuryV2 from 0xDAOTreasuryV2
    import ${contractName} from 0x${contractName}
    import MyMultiSigV2 from 0xMyMultiSigV2

    transaction(treasuryAddr: Address, message: String, messageHex: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

        let treasury: &DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}
        let messageSignaturePayload: MyMultiSigV2.MessageSignaturePayload
        
        prepare(signer: AuthAccount) {
            self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                            .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                                ?? panic("A DAOTreasuryV2 doesn't exist here.")
            var _keyIds: [Int] = []
        
            for keyId in keyIds {
                _keyIds.append(Int(keyId))
            }

            self.messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
                signingAddr: signer.address, message: message, messageHex: messageHex, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
            )
        }

        execute {
            let vault <- ${contractName}.createEmptyVault()
            self.treasury.signerDepositVault(vault: <- vault, signaturePayload: self.messageSignaturePayload)
        }
    }
`;