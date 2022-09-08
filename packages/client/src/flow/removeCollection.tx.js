export const REMOVE_COLLECTION = `
    import DAOTreasuryV4 from 0xDAOTreasuryV4
    import MyMultiSigV4 from 0xMyMultiSigV4

    transaction(treasuryAddr: Address, identifier: String, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

        prepare(signer: AuthAccount) {

            let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                        .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                        ?? panic("A DAOTreasuryV3 doesn't exist here.")

            var _keyIds: [Int] = []

            for keyId in keyIds {
                _keyIds.append(Int(keyId))
            }

            let messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
                signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
            )
            // Execute removing collection
            treasury.signerRemoveCollection(identifier: identifier, signaturePayload: messageSignaturePayload)
        }
    }
`;