import NonFungibleToken from 0x631e88ae7f1d7c20
import ExampleNFT from 0x68a4fe55ec686656

// This transaction is for transferring and NFT from
// one account to another
transaction(recipient: Address, withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let recipient = getAccount(recipient).getCapability(ExampleNFT.CollectionPublicPath)
                    .borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("An ExampleNFT Collection doesn't exist here.")

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        recipient.deposit(token: <-nft)
    }
}