export const REMOVE_COLLECTION = `
    import DAOTreasuryV5 from 0xDAOTreasuryV5
    import MyMultiSigV5 from 0xMyMultiSigV5

    transaction(treasuryAddr: Address, identifier: String, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

        prepare(signer: AuthAccount) {

            let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                        .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                        ?? panic("A DAOTreasuryV5 doesn't exist here.")

            var _keyIds: [Int] = []

            for keyId in keyIds {
                _keyIds.append(Int(keyId))
            }

            let messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
                signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
            )
            // Execute removing collection
            treasury.signerRemoveCollection(identifier: identifier, signaturePayload: messageSignaturePayload)
        }
    }
`;
