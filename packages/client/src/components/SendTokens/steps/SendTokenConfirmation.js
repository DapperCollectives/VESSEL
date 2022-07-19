import React from 'react'

const SendTokenConfirmation = () =>{
    return (
        <div className="p-5 has-text-black">
          <h2 className="is-size-4">{titleText}</h2>
          <div className="border-light-bottom mb-4 pb-5">
            <span className="border-light-right mr-2 pr-2 has-text-grey">
              From {name}
            </span>
            <span className="is-underlined">{shortenAddr(address)}</span>
          </div>
          {assetType === "FLOW" && (
              <div>
                <label className="has-text-grey">
                  Amount{step === 0 && <span className="has-text-red"> *</span>}
                </label>
                  <span className="is-size-2 column is-full p-0 mb-4">
                    {amount}
                  </span>
              </div>
            )}
          <div className="mt-4 pt-5">
            <div className="flex-1 is-flex is-flex-direction-column mb-4">
              <label className="has-text-grey mb-2">Asset</label>
              <div className="border-light rounded-sm p-1 is-flex column is-full">
                <button
                  className={`button border-none flex-1 ${
                    assetType === "FLOW" && "has-background-black has-text-white"
                  }`}
                  onClick={() => setAssetType("FLOW")}
                >
                  FLOW
                </button>
                <button
                  className={`button border-none flex-1 ${
                    assetType === "NFTs" && "has-background-black has-text-white"
                  }`}
                  onClick={() => setAssetType("NFTs")}
                >
                  NFTs
                </button>
              </div>
            </div>
    
            {assetType === "NFTs" && (
              <div className="border-light p-1 mb-4 rounded-sm">
                {nftsToDisplay.map((nft) => (
                  <div
                    key={nft.tokenId}
                    className={`rounded-sm ${
                      nft.collectionName + "-" + nft.tokenId === selectedNFT &&
                      "border"
                    }`}
                    onClick={() =>
                      setSelectedNFT(nft.collectionName + "-" + nft.tokenId)
                    }
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
            )}
              <div className="border-light-top is-flex is-justify-content-space-between py-5">
                <span className="has-text-grey">Sending to</span>
                <span>{shortenAddr(recipient)}</span>
              </div>
              <div className="border-light-top is-flex is-justify-content-space-between py-5">
                <span className="has-text-grey">Network fee</span>
                <span>$0</span>
              </div>
              <div className="border-light-top is-flex is-justify-content-space-between py-5">
                <span>Total</span>
                <span>{amount}</span>
              </div>
            <div className="is-flex is-align-items-center mt-6">
              <button
                className="button flex-1 p-4 mr-2"
                onClick={() => modalContext.closeModal()}
              >
                Cancel
              </button>
              <button className={btnClasses.join(" ")} onClick={onSubmit}>
                {btnText}
              </button>
            </div>
          </div>
        </div>
      );
}
export default SendTokenConfirmation