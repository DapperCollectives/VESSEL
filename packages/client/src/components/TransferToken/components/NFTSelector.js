import React from 'react';

const NFTSelector = ({ nftsToDisplay, selectedNFT, setSelectedNFT }) => {
  const { collectionName: selectedCollectionName, tokenId: selectedTokenId } =
    selectedNFT;
  if (nftsToDisplay.length === 0) {
    return (
      <div className="border-light p-1 mb-4 rounded-sm pl-2">
        No NFT to select
      </div>
    );
  }
  return (
    <div
      className="p-1 mb-4 rounded-sm is-flex is-flex-wrap-wrap "
      style={{ maxHeight: '200px', overflow: 'scroll' }}
    >
      {nftsToDisplay.map((nft) => {
        const { collectionName, tokenId, thumbnail } = nft;
        return (
          <button
            className={`has-background-white rounded-sm ${
              collectionName === selectedCollectionName &&
              tokenId === selectedTokenId
                ? 'border-heavy'
                : 'border-none'
            }`}
            type="button"
            onClick={() => setSelectedNFT(nft)}
          >
            <div
              key={tokenId}
              className="mr-1 mb-1"
              style={{
                cursor: 'pointer',
                minHeight: 66,
                minWidth: 66,
                width: 66,
                height: 66,
                backgroundImage: `url(${thumbnail.url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
              }}
            />
          </button>
        );
      })}
    </div>
  );
};
export default NFTSelector;
