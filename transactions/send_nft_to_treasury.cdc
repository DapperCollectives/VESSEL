import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"
import ZeedzINO from "../contracts/core/ZeedzINO.cdc"
import DAOTreasuryV5 from "../contracts/DAOTreasury.cdc"
import MyMultiSigV5 from "../contracts/MyMultiSig.cdc"

// This transaction is for transferring and NFT from
// one account to another
transaction(treasuryAddr: Address, withdrawID: UInt64) {

    prepare(signer: AuthAccount) {
        // borrow a reference to the signer's NFT collection
        let collectionRef = signer
            .borrow<&ZeedzINO.Collection>(from: ZeedzINO.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")

        let treasury = getAccount(treasuryAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
                    .borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
                    ?? panic("A DAOTreasuryV5 doesn't exist here.")

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)
        let identifier: String = collectionRef.getType().identifier

        treasury.depositNFT(identifier: identifier, nft: <- nft)
    }
}