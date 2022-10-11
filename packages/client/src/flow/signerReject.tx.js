export const SIGNER_REJECT = `
    import DAOTreasuryV5 from 0xDAOTreasuryV5
    import MyMultiSigV5 from 0xMyMultiSigV5

    transaction(treasuryAddr: Address, actionUUID: UInt64, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

    var isValid: Bool
    var action: &MyMultiSigV5.MultiSignAction
    var treasury: &DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}
    var messageSignaturePayload: MyMultiSigV5.MessageSignaturePayload
    
    prepare(signer: AuthAccount) {
        self.isValid = false
        self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                        .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                        ?? panic("A DAOTreasuryV5 doesn't exist here.")

        let manager = self.treasury.borrowManagerPublic()
        self.action = manager.borrowAction(actionUUID: actionUUID)

        var _keyIds: [Int] = []

        for keyId in keyIds {
        _keyIds.append(Int(keyId))
        }

        self.messageSignaturePayload = MyMultiSigV5.MessageSignaturePayload(
            signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
        )

    }
    execute {
        self.treasury.signerRejectAction(actionUUID: actionUUID, messageSignaturePayload: self.messageSignaturePayload)
    }
    }
`;
