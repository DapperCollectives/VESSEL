import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { Plus, Check } from "./Svg";
import { useModalContext } from "../contexts";
import { useAddressValidation } from "../hooks";
import { ASSET_TYPES } from "constants/enums";
import SendTokens from "./SendTokens";

const AddNFT = ({ web3, address, message, keyIds, signatures, height }) => {
  const modalContext = useModalContext();
  const [collectionPath, setCollectionPath] = useState("");
  const [isCollectionValid, setCollectionValid] = useState(false);
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const btnClasses = [
    "button p-4 flex-1",
    isCollectionValid ? "is-link" : "is-light is-disabled",
  ];

  const onSubmit = async () => {
    await web3.sendCollectionToTreasury(
      address,
      message,
      keyIds,
      signatures,
      height
    );
    modalContext.closeModal();
  };

  const onCollectionChange = async (e) => {
    let newValue = e.target.value;
    setCollectionPath(newValue);
    const isValid = await isAddressValid(newValue);
    setCollectionValid(isValid);
  };

  return (
    <div className="p-5 has-text-black">
      <h2 className="is-size-4">Add NFT Collection</h2>
      <div className="border-light-top mt-4 pt-5">
        <label className="has-text-grey mb-2">
          Address<span className="has-text-red"> *</span>
        </label>
        <div className="is-flex">
          <div className="flex-1" style={{ position: "relative" }}>
            <input
              style={{ height: 48 }}
              className="border-light rounded-sm column is-full p-2 mt-2"
              type="text"
              value={collectionPath}
              onChange={onCollectionChange}
            />
            {isCollectionValid && (
              <div style={{ position: "absolute", right: 17, top: 20 }}>
                <Check />
              </div>
            )}
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button
            className="button flex-1 p-4 mr-2"
            onClick={modalContext.closeModal}
          >
            Cancel
          </button>
          <button className={btnClasses.join(" ")} onClick={onSubmit}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

function SafeAssets({
  web3,
  name,
  address,
  message,
  keyIds,
  signatures,
  height,
}) {
  const assetComponents = [];
  const { getTreasuryCollections } = web3;
  const userAddr = web3?.user?.addr;
  const modalContext = useModalContext();

  useEffect(() => {
    if (!userAddr) {
      return;
    }
    const getCollections = async () => {
      await getTreasuryCollections(address);
    };
    getCollections();
    // eslint-disable-next-line
  }, [userAddr]);

  const userNFTs = web3?.NFTs?.[userAddr] ?? [];
  const nftsToDisplay = Object.entries(userNFTs)
    .map(([key, tokens]) => {
      if (isEmpty(tokens)) {
        return null;
      }
      return {
        key,
        collectionName: key.split(".")[2],
        tokens,
      };
    })
    .filter((x) => x);

  const showNFTModal = (collection, token) => {
    modalContext.openModal(
      <div className="p-5 has-text-black">
        <div>
          <img
            alt="token preview"
            src={token.thumbnail.url}
            className="is-block mx-auto"
          />
        </div>
        <div className="column is-flex is-full p-0 mt-4">
          <div className="flex-1">
            <p className="has-text-grey">Collection</p>
            <p className="mt-2">{collection.collectionName}</p>
          </div>
          <div className="flex-1">
            <p className="has-text-grey">Number</p>
            <p className="mt-2">{token.tokenId}</p>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button
            className="button flex-1 p-4 mr-2"
            onClick={() => modalContext.closeModal()}
          >
            Cancel
          </button>
          <button
            className="button flex-1 p-4 is-link"
            onClick={() =>
              modalContext.openModal(
                <SendTokens
                  name={name}
                  address={address}
                  initialState={{
                    assetType: ASSET_TYPES.NFT,
                    selectedNFT: collection.key + "-" + token.tokenId,
                  }}
                />
              )
            }
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  if (isEmpty(nftsToDisplay)) {
    assetComponents.push(
      <div
        className="is-flex is-justify-content-center is-flex-direction-column"
        key="nft-assets"
      >
        <div
          style={{
            height: "calc(100vh - 350px)",
          }}
          className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
        >
          <h2 className="is-size-4">You don't have any NFTs added</h2>

          <div className="is-flex border-light rounded-sm p-4 mt-4 pointer">
            <p
              className="has-text-grey"
              onClick={() =>
                modalContext.openModal(
                  <AddNFT
                    web3={web3}
                    address={address}
                    message={message}
                    keyId={keyIds}
                    signatures={signatures}
                    height={height}
                  />
                )
              }
            >
              <Plus style={{ position: "relative", top: 3 }} className="mr-2" />{" "}
              Add NFT Collection
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    nftsToDisplay.forEach((collection) => {
      assetComponents.push(
        <div
          className="is-flex is-justify-content-center is-flex-direction-column"
          key={collection.collectionName}
        >
          <h2 className="is-size-4">{collection.collectionName}</h2>
          <div className="is-flex mt-4">
            {collection.tokens.map((token) => (
              <div
                className="p-4 border-light rounded-sm pointer"
                key={token.tokenId}
                onClick={() => showNFTModal(collection, token)}
              >
                <img alt="token media" src={token.thumbnail.url} />
                <p>{token.name}</p>
                <p>{token.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  }

  return <div className="column mt-5 p-0">{assetComponents}</div>;
}

export default SafeAssets;
