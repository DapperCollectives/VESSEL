import { useContext, useState, useEffect } from "react";
import { formatAddress, parseIdentifier } from "utils";
import { Web3Context } from "contexts/Web3";
import ProposedDateView from "./ProposedDateView";
import SentFromToView from "./SentFromToView";

const NFTView = ({ actionView, safeData }) => {
  const { recipient, nftId, collectionId, timestamp } = actionView;
  const { address: safeAddress } = safeData;
  const { contractName: NFTName } = parseIdentifier(collectionId);

  const { getTreasuryNFTReference } = useContext(Web3Context);
  const [image, setImage] = useState({});

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
        <SentFromToView safeData={safeData} recipient={recipient} />
      </div>
    </>
  );
};

export default NFTView;
