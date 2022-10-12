import { useContext, useEffect, useState } from 'react';
import { Web3Context } from 'contexts/Web3';
import { formatAddress, parseIdentifier } from 'utils';
import ProposedDateView from './ProposedDateView';
import SentFromToView from './SentFromToView';

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
      <div className="m-1">
        {imageURI && (
          <img className="success-modal-image" src={imageURI} alt={imageName} />
        )}
        <div className="is-size-2 is-family-monospace has-text-black">
          #{nftId}
        </div>
        <span className="is-size-6 has-text-weight-bold has-text-black">
          {NFTName}
        </span>
      </div>
      <ProposedDateView timestamp={timestamp} />
      <SentFromToView safeData={safeData} recipient={recipient} />
    </>
  );
};

export default NFTView;
