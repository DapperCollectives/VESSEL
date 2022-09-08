export const GET_NFT_REF = (contractName, contractAddress) => `
    import NonFungibleToken from 0xNonFungibleToken
    import ${contractName} from ${contractAddress}

    pub fun main(accountAddr: Address, nftID: UInt64): &NonFungibleToken.NFT {
        let account = getAccount(accountAddr).getCapability(${contractName}.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("A NFT collection doesn't exist here.")

        return account.borrowNFT(id: nftID)
    }
`;
