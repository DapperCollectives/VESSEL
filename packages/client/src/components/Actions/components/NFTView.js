import { useContext, useState, useEffect } from "react";
import { formatAddress, getNameByAddress, parseIdentifier } from "utils";
import { useClipboard, useContacts } from "hooks";
import { Web3Context } from "contexts/Web3";
import Svg from "library/Svg";
import ProposedDateView from "./ProposedDateView";

const NFTView = ({ actionView, safeData }) => {
  const { recipient, nftId, collectionId, timestamp } = actionView;
  const { name: safeName, address: safeAddress } = safeData;
  const { contractName: NFTName } = parseIdentifier(collectionId);

  const { getTreasuryNFTReference } = useContext(Web3Context);
  const { contacts } = useContacts(safeAddress);
  const [image, setImage] = useState({});
  const clipboard = useClipboard();

  const { name: imageName, imageURI } = image;

  useEffect(() => {
    const getImageURL = async () => {
      const result = await getTreasuryNFTReference(
        NFTName,
        formatAddress(safeAddress),
        collectionId,
        recipient,
        nftId
      );
      setImage(result);
    };
    getImageURL().catch(console.error);
  }, [
    NFTName,
    safeAddress,
    nftId,
    collectionId,
    recipient,
    getTreasuryNFTReference,
  ]);

  return (
    <>
      <div className="pl-4 mb-5">
        {imageURI && (
          <img
            className="columns success-modal-image"
            src={imageURI}
            alt={imageName}
          />
        )}
        <span className="columns is-size-2 is-family-monospace has-text-black">
          #{nftId}
        </span>
        <span className="columns is-size-6 has-text-weight-bold has-text-black">
          {NFTName}
        </span>
      </div>
      <div className="mt-4">
        <ProposedDateView timestamp={timestamp} />
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="flex-1 has-text-grey">Sent From</span>
          <div className="flex-1">
            <span className="has-text-weight-bold has-text-black">
              {safeName}
            </span>
            <div>
              <span className="has-text-grey">{safeAddress}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(safeAddress)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="has-text-grey flex-1">Sent To</span>
          <div className="flex-1">
            <span className="has-text-weight-bold has-text-black">
              {getNameByAddress(contacts, recipient)}
            </span>
            <div>
              <span className="has-text-grey">{recipient}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(recipient)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NFTView;
