import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, identifier: String, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

    prepare(signer: AuthAccount) {

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

        var _keyIds: [Int] = []

        for keyId in keyIds {
            _keyIds.append(Int(keyId))
        }

        let messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
            signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
        )
        // Deposit the NFT in the treasury's collection
        treasury.signerRemoveVault(identifier: identifier, signaturePayload: messageSignaturePayload)
    }
}