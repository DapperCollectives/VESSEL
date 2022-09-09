import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ZeedzINO from "../contracts/core/ZeedzINO.cdc"

transaction(
    recipient: Address,
    name: String,
    description: String,
    thumbnail: String,
) {

    // local variable for storing the minter reference
    let minter: &ZeedzINO.Administrator

    prepare(signer: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&ZeedzINO.Administrator>(from: ZeedzINO.AdminStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(ZeedzINO.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(
            recipient: receiver, 
            name: name, 
            description: description, 
            typeID: 0, 
            serialNumber: "123", 
            edition: 0, 
            editionCap: 0, 
            evolutionStage: 0, 
            rarity: "rare", 
            imageURI: thumbnail
        )
    }
}