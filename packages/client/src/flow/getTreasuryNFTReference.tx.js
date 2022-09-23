export const GET_TREASURY_NFT_REF = (contractName, contractAddress, collectionId) => `
    import NonFungibleToken from 0xNonFungibleToken
    import DAOTreasuryV5 from 0xDAOTreasuryV5
    import ${contractName} from ${contractAddress}

    pub fun main(accountAddr: Address, nftID: UInt64): &NonFungibleToken.NFT {
        let treasury = getAccount(accountAddr).getCapability(DAOTreasuryV5.TreasuryPublicPath)
						.borrow<&DAOTreasuryV5.Treasury{DAOTreasuryV5.TreasuryPublic}>()
						?? panic("A DAOTreasuryV5 doesn't exist here.")

        let collection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: "${collectionId}")

        return collection.borrowNFT(id: nftID)
    }
`;