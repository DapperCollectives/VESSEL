import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import DAOTreasuryV4 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV4 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, identifier: String, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

    prepare(signer: AuthAccount) {

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV4 doesn't exist here.")

        var _keyIds: [Int] = []

        for keyId in keyIds {
            _keyIds.append(Int(keyId))
        }

        let messageSignaturePayload = MyMultiSigV4.MessageSignaturePayload(
            signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
        )
        // Execute removing vault
        treasury.signerRemoveVault(identifier: identifier, signaturePayload: messageSignaturePayload)
    }
}