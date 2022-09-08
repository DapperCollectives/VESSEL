import ZeedzINO from "../contracts/core/ZeedzINO.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"

pub fun main(accountAddress: Address): [&NonFungibleToken.NFT] {
  let account = getAccount(accountAddress).getCapability(ZeedzINO.CollectionPublicPath)
                    .borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("A NFT collection doesn't exist here.")

  let ids = account.getIDs();
  let nftRefs: [&NonFungibleToken.NFT] = []
  for id in ids  {
    let nftRef: &NonFungibleToken.NFT  = account.borrowNFT(id: id)
    nftRefs.append(nftRef)
  }
  return nftRefs
}