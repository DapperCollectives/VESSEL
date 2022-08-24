import ZeedzINO from "../contracts/core/ZeedzINO.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"

pub fun main(accountAddress: Address) : Capability {
  return getAccount(accountAddress).getCapability(/public/exampleNFTCollection)!
  // let account = getAccount(accountAddress).getCapability(ZeedzINO.CollectionPublicPath)
  //                   .borrow<&ZeedzINO.Collection{ZeedzINO.ZeedzCollectionPublic}>()
  //                   ?? panic("A NFT collection doesn't exist here.")

  // let ids = account.getIDs();
  // let nftRefs: [&NonFungibleToken.NFT] = []
  // for id in ids  {
  //   let nftRef: &NonFungibleToken.NFT  = account.borrowNFT(id: id)
  //   nftRefs.append(nftRef)
  // }
  // return nftRefs
}