export const GET_NFT_REF = `
    import NonFungibleToken from 0xNonFungibleToken
    import ZeedzINO from 0xZeedzINO

    pub fun main(accountAddr: Address, nftID: UInt64): &NonFungibleToken.NFT {
        let account = getAccount(accountAddr).getCapability(ZeedzINO.CollectionPublicPath)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("A NFT collection doesn't exist here.")

        return account.borrowNFT(id: nftID)
    }
`;
