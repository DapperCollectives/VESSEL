import React from "react";
const NFTSelector = ({ nftsToDisplay, selectedNFT, setSelectedNFT }) => {
  return (
    <div className="border-light p-1 mb-4 rounded-sm">
      {nftsToDisplay.map((nft) => (
        <div
          key={nft.tokenId}
          className={`rounded-sm ${
            nft.collectionName + "-" + nft.tokenId === selectedNFT && "border"
          }`}
          onClick={() => setSelectedNFT(nft.collectionName + "-" + nft.tokenId)}
          style={{
            height: 80,
            width: 80,
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
