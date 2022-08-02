import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import DAOTreasuryV2 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV2 from "../contracts/MyMultiSig.cdc"

transaction(treasuryAddr: Address, message: String, keyIds: [UInt64], signatures: [String], signatureBlock: UInt64) {

    prepare(signer: AuthAccount) {

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV2.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV2.Treasury{DAOTreasuryV2.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV2 doesn't exist here.")

        let collection <- ExampleNFT.createEmptyCollection()

        var _keyIds: [Int] = []

        for keyId in keyIds {
            _keyIds.append(Int(keyId))
        }

        let messageSignaturePayload = MyMultiSigV2.MessageSignaturePayload(
            signingAddr: signer.address, message: message, keyIds: _keyIds, signatures: signatures, signatureBlock: signatureBlock
        )
        // Deposit the NFT in the treasury's collection
        treasury.signerDepositCollection(collection: <-collection, signaturePayload: messageSignaturePayload)
    }
}