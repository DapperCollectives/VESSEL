import React from 'react'
const SendTokenForm = ()=>{
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
                  <input
                    type="number"
                    className="is-size-2 border-none column is-full p-0 mb-4"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
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
              <>
                <label className="has-text-grey mb-2">
                  Address{step === 0 && <span className="has-text-red"> *</span>}
                </label>
    
                <div className="is-flex">
                  <div className="flex-1" style={{ position: "relative" }}>
                    <input
                      style={{ height: 48 }}
                      className="border-light rounded-sm column is-full p-2 mt-2"
                      type="text"
                      value={recipient}
                      onChange={onRecipientChange}
                    />
                    {recipientValid && (
                      <div style={{ position: "absolute", right: 17, top: 20 }}>
                        <Check />
                      </div>
                    )}
                  </div>
                </div>
              </>
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
export default SendTokenForm