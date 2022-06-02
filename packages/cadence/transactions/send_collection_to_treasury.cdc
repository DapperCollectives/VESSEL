import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import DAOTreasury from "../contracts/DAOTreasury.cdc"
import MyMultiSig from "../contracts/MyMultiSig.cdc"

// This transaction is for transferring and NFT from
// one account to another
transaction(treasuryAddr: Address) {

    prepare(signer: AuthAccount) {
        // get the recipients public account object
        // let recipient = getAccount(treasuryAddr)

        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasury.TreasuryPublicPath)
                    .borrow<&DAOTreasury.Treasury{DAOTreasury.TreasuryPublic}>()
                    ?? panic("A DAOTreasury doesn't exist here.")

        let collection <- ExampleNFT.createEmptyCollection()

        // Deposit the NFT in the treasury's collection
        treasury.depositCollection(collection: <-collection)
    }
}