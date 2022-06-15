import React, { useState } from "react";
import { flatten } from "lodash";
import { useHistory } from "react-router-dom";
import { useModalContext } from "../contexts";
import { useAddressValidation } from "../hooks";
import { isAddr, shortenAddr } from "../utils";
import { Check } from "./Svg";

const SendTokens = ({ name, address, web3, initialState }) => {
  const history = useHistory();
  const modalContext = useModalContext();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [recipientValid, setRecipientValid] = useState(false);
  const [assetType, setAssetType] = useState(initialState?.assetType || "FLOW");
  const [selectedNFT, setSelectedNFT] = useState(
    initialState?.selectedNFT || ""
  );
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const continueReady =
    recipientValid && (assetType === "FLOW" ? amount > 0 : selectedNFT);
  const btnText = continueReady ? "Sign & Deploy" : "Next";
  const titleText = continueReady ? "Confirm Transaction" : "Send";

  const btnClasses = [
    "button p-4 flex-1",
    continueReady ? "is-link" : "is-light is-disabled",
  ];

  const onSubmit = async () => {
    if (step === 0) {
      return setStep(1);
    }
    if (step === 1) {
      if (assetType === "FLOW") {
        await web3.proposeTransfer(recipient, amount);
      } else {
        await web3.proposeNFTTransfer(address, recipient, selectedNFT);
      }
      await web3.refreshTreasury();
      modalContext.closeModal();
      history.push(`/safe/${address}`);
    }
  };

  const onRecipientChange = async (e) => {
    let newValue = e.target.value;

    setRecipient(newValue);
    let isValid = isAddr(e.target.value);
    if (isValid) {
      isValid = await isAddressValid(e.target.value);
    }
    setRecipientValid(isValid);
  };

  const userAddr = web3?.user?.addr;
  const userNFTs = web3?.NFTs?.[userAddr] ?? [];
  const nftsToDisplay = flatten(
    Object.entries(userNFTs).map(([collectionName, tokens]) =>
      tokens.map((t) => ({
        ...t,
        collectionName,
      }))
    )
  );

  return (
    <div className="p-5 has-text-black">
      <h2 className="is-size-4">{titleText}</h2>
      <div>
        <span className="border-light-right mr-2 pr-2 has-text-grey">
          From {name}
        </span>
        <span className="is-underlined">{shortenAddr(address)}</span>
      </div>
      <div className="border-light-top mt-4 pt-5">
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
        {assetType === "FLOW" && (
          <>
            <label className="has-text-grey">
              Amount{step === 0 && <span className="has-text-red"> *</span>}
            </label>
            {step === 0 ? (
              <input
                type="number"
                className="is-size-2 border-none column is-full p-0 mb-4"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            ) : (
              <span className="is-size-2 column is-full p-0 mb-4">
                {amount}
              </span>
            )}
          </>
        )}
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
        {step === 0 ? (
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
        ) : (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span className="has-text-grey">Sending to</span>
            <span>{shortenAddr(recipient)}</span>
          </div>
        )}
        {step === 1 && (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span className="has-text-grey">Network fee</span>
            <span>$0</span>
          </div>
        )}
        {step === 1 && (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span>Total</span>
            <span>{amount}</span>
          </div>
        )}
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
};

export default SendTokens;
