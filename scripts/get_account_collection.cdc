import ExampleNFT from "../contracts/core/ExampleNFT.cdc"

pub fun main(accountAddress: Address): [UInt64] {
  let account = getAccount(accountAddress).getCapability(ExampleNFT.CollectionPublicPath)
                    .borrow<&ExampleNFT.Collection{ExampleNFT.ExampleNFTCollectionPublic}>()
                    ?? panic("A NFT collection doesn't exist here.")

  return account.getIDs();
}