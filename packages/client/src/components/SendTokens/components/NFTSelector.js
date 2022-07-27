import React from "react";
const NFTSelector = ({ nftsToDisplay, selectedNFT, setSelectedNFT }) => {
  //   nftsToDisplay = [
  //     ...nftsToDisplay,
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //     {
  //       collectionName: "A.f8d6e0586b0a20c7.ExampleNFT.Collection",
  //       description: "description",
  //       name: "A.f8d6e0586b0a20c7.ExampleNFT.Collection #0",
  //       thumbnail: {
  //         url: "https://dummyimage.com/256x256/e0e0e0/000&text=A.f8d6e0586b0a20c7.ExampleNFT.Collection+#0",
  //       },
  //       tokenId: "0",
  //     },
  //   ];
  if (nftsToDisplay.length == 0) {
    return (
      <div className="border-light p-1 mb-4 rounded-sm pl-2">
        No NFT to select
      </div>
    );
  }
  return (
    <div
      className="border-light p-1 mb-4 rounded-sm is-flex is-flex-wrap-wrap "
      style={{ maxHeight: "200px", overflow: "scroll" }}
    >
      {nftsToDisplay.map((nft) => (
        <div
          key={nft.tokenId}
          className={`mr-1 mb-1 ${
            nft.collectionName + "-" + nft.tokenId === selectedNFT && "border"
          }`}
          onClick={() =>
            setSelectedNFT(
              nft.collectionName + "-" + nft.tokenId,
              nft.thumbnail.url
            )
          }
          style={{
            cursor: "pointer",
            minHeight: 80,
            minWidth: 80,
            width: 80,
            height: 80,
            backgroundImage: `url(${nft.thumbnail.url})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        />
      ))}
    </div>
  );
};
export default NFTSelector;
