import BloctoToken from "../contracts/core/BloctoToken.cdc"
import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

    let treasury: &DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}
    let messageSignaturePayload: MyMultiSigV3.MessageSignaturePayload
    
    prepare(signer: AuthAccount) {
        self.treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                        .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                            ?? panic("A DAOTreasuryV3 doesn't exist here.")
        var _keyIds: [Int] = []
    
        for keyId in keyIds {
            _keyIds.append(Int(keyId))
        }

        self.messageSignaturePayload = MyMultiSigV3.MessageSignaturePayload(
            signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
        )
    }

    execute {
        let vault <- BloctoToken.createEmptyVault()
        self.treasury.signerDepositVault(vault: <- vault, signaturePayload: self.messageSignaturePayload)
    }
}