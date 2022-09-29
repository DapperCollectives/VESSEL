export const MINT_NFT = `
    import NonFungibleToken from 0xNonFungibleToken
    import ZeedzINO from 0xZeedzINO

    transaction(
        name: String,
        description: String,
        thumbnail: String,
    ) {

        // local variable for storing the minter reference
        let minter: &ZeedzINO.Administrator
        let receiver: &AnyResource{NonFungibleToken.CollectionPublic}

        prepare(signer: AuthAccount) {
            // borrow a reference to the NFTMinter resource in storage
            self.minter = signer.borrow<&ZeedzINO.Administrator>(from: ZeedzINO.AdminStoragePath)
                ?? panic("Could not borrow a reference to the NFT minter")

            self.receiver = signer
                .getCapability(ZeedzINO.CollectionPublicPath)
                .borrow<&{NonFungibleToken.CollectionPublic}>()
                ?? panic("Could not get receiver reference to the NFT Collection")
        }

        execute {            

            // Mint the NFT and deposit it to the recipient's collection
            self.minter.mintNFT(
                recipient: self.receiver, 
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
`;
