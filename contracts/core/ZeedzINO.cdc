// Copied from: https://flow-view-source.com/testnet/account/0x7dc7430a06f38af3/contract/ZeedzINO

import NonFungibleToken from "./NonFungibleToken.cdc"
import MetadataViews from "./MetadataViews.cdc"

/*
    Description: Central Smart Contract for the first generation of Zeedle NFTs

    Zeedles are cute little nature-inspired monsters that grow with the real world weather.
    They are the main characters of Zeedz, the first play-for-purpose game where players 
    reduce global carbon emissions by growing Zeedles. 
    
    This smart contract encompasses the main functionality for the first generation
    of Zeedle NFTs. 

    Oriented much on the standard NFT contract, each Zeedle NFT has a certain typeID,
    which is the type of Zeedle - e.g. "Baby Aloe Vera" or "Ginger Biggy". A contract-level
    dictionary takes account of the different quentities that have been minted per Zeedle type.

    Different types also imply different rarities, and these are also hardcoded inside 
    the given Zeedle NFT in order to allow the direct querying of the Zeedle's rarity 
    in external applications and wallets.

    Each batch-minting of Zeedles is resembled by an edition number, with the community pre-sale 
    being the first-ever edition (0). This way, each Zeedle can be traced back to the edition it
    was created in, and the number of minted Zeedles of that type in the specific edition.

    Many of the in-game purchases lead to real-world donations to NGOs focused on climate action. 
    The carbonOffset attribute of a Zeedle proves the impact the in-game purchases related to this Zeedle
    have already made with regards to reducing greenhouse gases. This value is computed by taking the 
    current dollar-value of each purchase at the time of the purchase, and applying the dollar-to-CO2-offset
    formular of the current climate action partner. 
*/
pub contract ZeedzINO: NonFungibleToken {

    //  Events
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, name: String, description: String, typeID: UInt32, serialNumber: String, edition: UInt32, rarity: String)
    pub event Burned(id: UInt64, from: Address?)
    pub event Offset(id: UInt64, amount: UInt64)
    pub event Redeemed(id: UInt64, message: String, from: Address?)

    //  Named Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath
    pub let AdminPrivatePath: PrivatePath

    pub var totalSupply: UInt64

    access(contract) var numberMintedPerType: {UInt32: UInt64}

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        //  The token's ID
        pub let id: UInt64
        //  The memorable short name for the Zeedle, e.g.  Baby Aloe"
        pub let name: String 
        //  A short description of the Zeedle's type
        pub let description: String 
        //  Number id of the Zeedle type -> e.g "1 = Ginger Biggy, 2 = Baby Aloe, etc 
        pub let typeID: UInt32
        //  A Zeedle's unique serial number from the Zeedle's edition 
        pub let serialNumber: String
        //  Number id of the Zeedle's edition -> e.g "1 = first edition, 2 = second edition, etc"  
        pub let edition: UInt32 
        //  The total number of Zeedle's minted in this edition
        pub let editionCap: UInt32 
        //  The Zeedle's evolutionary stage 
        pub let evolutionStage: UInt32
        //  The Zeedle's rarity -> e.g "RARE, COMMON, LEGENDARY, etc" 
        pub let rarity: String
        //  URI to the image of the Zeedle 
        pub let imageURI: String
        //  The total amount this Zeedle has contributed to offsetting CO2 emissions
        pub var carbonOffset: UInt64

        init(initID: UInt64, initName: String, initDescription: String, initTypeID: UInt32, initSerialNumber: String, initEdition: UInt32, initEditionCap: UInt32, initEvolutionStage: UInt32, initRarity: String, initImageURI: String) {
            self.id = initID
            self.name = initName
            self.description = initDescription
            self.typeID = initTypeID
            self.serialNumber = initSerialNumber
            self.edition = initEdition
            self.editionCap = initEditionCap
            self.evolutionStage = initEvolutionStage
            self.rarity = initRarity
            self.imageURI = initImageURI
            self.carbonOffset = 0
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.Traits>(),
                Type<MetadataViews.Rarity>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.IPFSFile(
                            cid: self.imageURI, 
                            path: nil
                        )
                    )
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://play.zeedz.io/")
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: ZeedzINO.CollectionStoragePath,
                        publicPath: ZeedzINO.CollectionPublicPath,
                        providerPath: /private/ZeedzINOCollection,
                        publicCollection: Type<&ZeedzINO.Collection{ZeedzINO.ZeedzCollectionPublic}>(),
                        publicLinked: Type<&ZeedzINO.Collection{ZeedzINO.ZeedzCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&ZeedzINO.Collection{ZeedzINO.ZeedzCollectionPublic, NonFungibleToken.CollectionPublic, NonFungibleToken.Provider, MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-ZeedzINO.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let mediaSquare = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://play.zeedz.io/logo-zeedz.svg"
                        ),
                        mediaType: "image/svg+xml"
                    )
                    let mediaBanner = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://play.zeedz.io/background-zeedz.jpg"
                        ),
                        mediaType: "image/png"
                    )
                    let socials = {
                        "twitter": MetadataViews.ExternalURL("https://twitter.com/zeedz_official"),
                        "discord":  MetadataViews.ExternalURL("http://discord.com/invite/zeedz"),
                        "linkedin": MetadataViews.ExternalURL("https://www.linkedin.com/company/zeedz"),
                        "medium": MetadataViews.ExternalURL("https://blog.zeedz.io/"), 
                        "instagram": MetadataViews.ExternalURL("https://www.instagram.com/zeedz_official/"),
                        "youtube": MetadataViews.ExternalURL("https://www.youtube.com/c/zeedz_official")
                    }
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Zeedz",
                        description: "Zeedz is the first play-for-purpose game where players reduce global carbon emissions by collecting plant-inspired creatures: Zeedles. They live as NFTs on an eco-friendly blockchain (Flow) and grow with the real-world weather.",
                        externalURL: MetadataViews.ExternalURL("https://play.zeedz.io"),
                        squareImage: mediaSquare,
                        bannerImage: mediaBanner,
                        socials: socials
                    )
                case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties([])
                case Type<MetadataViews.Traits>():
                    let editionTrait = MetadataViews.Trait(
                        name: "edition number",
                        value: self.edition,
                        displayType: nil,
                        rarity: nil)
                    let editionCapTrait = MetadataViews.Trait(
                        name: "total minted in edition",
                        value: self.editionCap,
                        displayType: nil,
                        rarity: nil)
                    let serialNumberTrait = MetadataViews.Trait(
                        name: "serial number",
                        value: self.serialNumber,
                        displayType: nil,
                        rarity: nil)
                    let evolutionStageTrait = MetadataViews.Trait(
                        name: "evolution stage",
                        value: self.evolutionStage,
                        displayType: nil,
                        rarity: nil)
                    let carbonOffsetTrait = MetadataViews.Trait(
                        name: "carbon offset",
                        value: self.carbonOffset,
                        displayType: nil,
                        rarity: nil)
                    return MetadataViews.Traits([
                        editionTrait,
                        editionCapTrait,
                        serialNumberTrait,
                        evolutionStageTrait,
                        carbonOffsetTrait
                    ])         
                case Type<MetadataViews.Rarity>(): 
                    var rarityScore = 0.0
                    let maxRarityScore = 5.0
                    switch (self.rarity) {
                        case "COMMON": 
                            rarityScore = 1.0
                        case "RARE":
                            rarityScore = 2.0
                        case "EPIC": 
                            rarityScore = 3.0
                        case "LEGENDARY": 
                            rarityScore = 4.0
                        case "CUSTOM": 
                            rarityScore = 5.0
                        default: 
                            rarityScore = 0.0
                    }
                    return MetadataViews.Rarity(score: rarityScore, max: maxRarityScore, description: self.rarity)
            }
            return nil
        }

        pub fun getMetadata(): {String: AnyStruct} {
            return {"name": self.name, "description": self.description, "typeID": self.typeID, "serialNumber": self.serialNumber, "edition": self.edition, "editionCap": self.editionCap, "evolutionStage": self.evolutionStage, "rarity": self.rarity, "imageURI": self.imageURI, "carbonOffset": self.carbonOffset}
        }

        access(contract) fun increaseOffset(amount: UInt64) {
            self.carbonOffset = self.carbonOffset + amount
        }

        access(contract) fun changeOffset(offset: UInt64) {
            self.carbonOffset = offset
        }
    }

    // 
    //  This is the interface that users can cast their Zeedz Collection as
    //  to allow others to deposit Zeedles into their Collection. It also allows for reading
    //  the details of Zeedles in the Collection.
    // 
    pub resource interface ZeedzCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowZeedle(id: UInt64): &ZeedzINO.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Zeedle reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // 
    //  This is the interface that users can cast their Zeedz Collection as
    //  to allow themselves to call the burn function on their own collection.
    // 
    pub resource interface ZeedzCollectionPrivate {
        pub fun burn(burnID: UInt64)
        pub fun redeem(redeemID: UInt64, message: String)
    }

    //
    //  A collection of Zeedz NFTs owned by an account.
    //   
    pub resource Collection: ZeedzCollectionPublic, ZeedzCollectionPrivate, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("Not able to find specified NFT within the owner's collection")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <-token
        }

        pub fun burn(burnID: UInt64){
            let token <- self.ownedNFTs.remove(key: burnID) ?? panic("Not able to find specified NFT within the owner's collection")
            let zeedle <- token as! @ZeedzINO.NFT

            //  reduce numberOfMinterPerType
            ZeedzINO.numberMintedPerType[zeedle.typeID] = ZeedzINO.numberMintedPerType[zeedle.typeID]! - (1 as UInt64)

            destroy zeedle
            emit Burned(id: burnID, from: self.owner?.address)
        }

        pub fun redeem(redeemID: UInt64, message: String){
            let token <- self.ownedNFTs.remove(key: redeemID) ?? panic("Not able to find specified NFT within the owner's collection")
            let zeedle <- token as! @ZeedzINO.NFT

            //  reduce numberOfMinterPerType
            ZeedzINO.numberMintedPerType[zeedle.typeID] = ZeedzINO.numberMintedPerType[zeedle.typeID]! - (1 as UInt64)

            destroy zeedle
            emit Redeemed(id: redeemID, message: message, from: self.owner?.address)
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ZeedzINO.NFT
            let id: UInt64 = token.id
            //  add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token
            emit Deposit(id: id, to: self.owner?.address)
            destroy oldToken
        }

        //
        //  Returns an array of the IDs that are in the collection.
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        //
        //  Gets a reference to an NFT in the collection
        //  so that the caller can read its metadata and call its methods.
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        //
        //  Gets a reference to an NFT in the collection as a Zeed,
        //  exposing all of its fields
        //  this is safe as there are no functions that can be called on the Zeed.
        //
        pub fun borrowZeedle(id: UInt64): &ZeedzINO.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &ZeedzINO.NFT
            } else {
                return nil
            }
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let zeedzINO = nft as! &ZeedzINO.NFT
            return zeedzINO as &AnyResource{MetadataViews.Resolver}
        }

        init () {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    //
    //  Public function that anyone can call to create a new empty collection.
    // 
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    //
    //  The Administrator resource that an Administrator or something similar 
    //  would own to be able to mint & level-up NFT's.
    //
    pub resource Administrator {

        //
        //  Mints a new NFT with a new ID
        //  and deposit it in the recipients collection using their collection reference.
        //
        pub fun mintNFT(recipient: &{NonFungibleToken.CollectionPublic}, name: String, description: String, typeID: UInt32, serialNumber: String, edition: UInt32, editionCap: UInt32, evolutionStage: UInt32, rarity: String, imageURI: String) {
            recipient.deposit(token: <-create ZeedzINO.NFT(initID: ZeedzINO.totalSupply, initName: name, initDescription: description, initTypeID: typeID, initSerialNumber: serialNumber, initEdition: edition, initEdition: editionCap, initEvolutionStage: evolutionStage, initRarity: rarity, initImageURI: imageURI))
            emit Minted(id: ZeedzINO.totalSupply, name: name, description: description, typeID: typeID, serialNumber: serialNumber, edition: edition, rarity: rarity)

            // increase numberOfMinterPerType and totalSupply
            ZeedzINO.totalSupply = ZeedzINO.totalSupply + (1 as UInt64)
            if ZeedzINO.numberMintedPerType[typeID] == nil {
                ZeedzINO.numberMintedPerType[typeID] = 1 
            } else {
                ZeedzINO.numberMintedPerType[typeID] = ZeedzINO.numberMintedPerType[typeID]! + (1 as UInt64)
            }
        }

        //
        //  Increase the Zeedle's total carbon offset by the given amount
        //
        pub fun increaseOffset(zeedleRef: &ZeedzINO.NFT, amount: UInt64) {
            zeedleRef.increaseOffset(amount: amount)
            emit Offset(id: zeedleRef.id, amount: zeedleRef.carbonOffset)
        }

        //
        //  Change the Zeedle's total carbon offset to the given amount
        //
        pub fun changeOffset(zeedleRef: &ZeedzINO.NFT, offset: UInt64) {
            zeedleRef.changeOffset(offset: offset)
            emit Offset(id: zeedleRef.id, amount: offset)
        }
    }

    //
    //  Get a reference to a Zeedle from an account's Collection, if available.
    //  If an account does not have a Zeedz.Collection, panic.
    //  If it has a collection but does not contain the zeedleId, return nil.
    //  If it has a collection and that collection contains the zeedleId, return a reference to that.
    //
    pub fun fetch(_ from: Address, zeedleID: UInt64): &ZeedzINO.NFT? {
        let capability = getAccount(from).getCapability<&ZeedzINO.Collection{ZeedzINO.ZeedzCollectionPublic}>(ZeedzINO.CollectionPublicPath)
        if capability.check() {
            let collection = capability.borrow()
            return collection!.borrowZeedle(id: zeedleID)
        } else {
            return nil
        }
    }

    // 
    //  Returns the number of minted Zeedles for each Zeedle type.
    //
    pub fun getMintedPerType(): {UInt32: UInt64} {
        return self.numberMintedPerType
    }


    init() {
        self.CollectionStoragePath = /storage/ZeedzINOCollection
        self.CollectionPublicPath = /public/ZeedzINOCollection
        self.AdminStoragePath = /storage/ZeedzINOMinter
        self.AdminPrivatePath= /private/ZeedzINOAdminPrivate

        self.totalSupply = 0
        self.numberMintedPerType = {}

        self.account.save(<- create Administrator(), to: self.AdminStoragePath)
        self.account.link<&Administrator>(self.AdminPrivatePath, target: self.AdminStoragePath)

        emit ContractInitialized()
    }
}