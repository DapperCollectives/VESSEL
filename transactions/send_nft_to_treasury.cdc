import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import DAOTreasuryV3 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV3 from "../contracts/MyMultiSig.cdc"

// This transaction is for transferring and NFT from
// one account to another
transaction(treasuryAddr: Address, withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ExampleNFT.Collection>(from: ExampleNFT.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV3.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV3.Treasury{DAOTreasuryV3.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV3 doesn't exist here.")

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)
        let identifier: String = collectionRef.getType().identifier

        treasury.depositNFT(identifier: identifier, nft: <- nft)
    }
}