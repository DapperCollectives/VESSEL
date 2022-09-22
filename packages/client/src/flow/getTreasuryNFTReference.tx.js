export const GET_TREASURY_NFT_REF = (contractName, contractAddress, collectionId) => `
    import NonFungibleToken from 0xNonFungibleToken
    import DAOTreasuryV4 from 0xDAOTreasuryV4
    import ${contractName} from ${contractAddress}

    pub fun main(accountAddr: Address, nftID: UInt64): &NonFungibleToken.NFT {
        let treasury = getAccount(accountAddr).getCapability(DAOTreasuryV4.TreasuryPublicPath)
						.borrow<&DAOTreasuryV4.Treasury{DAOTreasuryV4.TreasuryPublic}>()
						?? panic("A DAOTreasuryV4 doesn't exist here.")

        let collection: &{NonFungibleToken.CollectionPublic} = treasury.borrowCollectionPublic(identifier: "${collectionId}")

        return collection.borrowNFT(id: nftID)
    }
`;