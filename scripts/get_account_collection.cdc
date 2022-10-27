import ExampleNFT from "../contracts/core/ExampleNFT.cdc"
import NonFungibleToken from "../contracts/core/NonFungibleToken.cdc"

pub fun main(accountAddress: Address): [UInt64] {
  let account = getAccount(accountAddress).getCapability(ExampleNFT.CollectionPublicPath)
                    .borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("A NFT collection doesn't exist here.")

  let ids = account.getIDs();
  return ids 
}