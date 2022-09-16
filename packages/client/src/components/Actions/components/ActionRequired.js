import { getTokenMeta, parseIdentifier, formatAddress } from "utils";
import { ACTION_TYPES } from "constants/enums";
import Svg from "library/Svg";
import { useClipboard, useContacts } from "hooks";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "contexts/Web3";

const ActionRequired = ({
  safeData,
  actionView,
  confirmations,
  onReject,
  onApprove,
}) => {
  const actionType = actionView.type;
  const {
    recipient,
    signerAddr,
    newThreshold,
    nftId,
    collectionId,
    vaultId,
    tokenAmount,
  } = actionView;
  const { getTreasuryNFTReference } = useContext(Web3Context);
  const { safeName, address: safeAddress, safeOwners } = safeData;

  const { contacts } = useContacts(safeAddress);
  const { contractName: NFTName, contractAddress: NFTAddress } =
    parseIdentifier(collectionId) || {};

  const [image, setImage] = useState();
  const clipboard = useClipboard();

  useEffect(() => {
    if (actionType === ACTION_TYPES.TRANSFER_NFT) {
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
    }
  }, [
    actionType,
    NFTName,
    NFTAddress,
    nftId,
    recipient,
    getTreasuryNFTReference,
  ]);

  function getSafeContactName(address) {
    const contact = contacts.find((contact) => contact.address === address);
    return contact?.name;
  }

  const getTokenView = () => {
    const { displayName, tokenType } = getTokenMeta(vaultId) || {};
    return (
      <>
        <div className="pl-4 mb-4">
          <span className="columns">Amount</span>
          <span className="columns is-size-2 is-family-monospace has-text-black">
            {Number(tokenAmount)}
          </span>
          <span className="columns is-size-6 has-text-weight-bold has-text-black">
            <Svg name={tokenType} /> &nbsp; {displayName}
          </span>
        </div>
        <div className="mt-4 border-light-top">
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
                {getSafeContactName(recipient)}
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

  const getNFTView = () => {
    const { name: imageName, imageURI } = image || {};
    return (
      <>
        <div className="pl-4 mb-4">
          <span className="columns">NFT</span>
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
        <div className="mt-4 border-light-top">
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
                {getSafeContactName(recipient)}
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

  const getOwnerView = (isAdd) => {
    const signerName = getSafeContactName(signerAddr);
    return (
      <div className="pl-4 mb-4">
        <span className="columns">{isAdd ? "New Owner" : "Remove Owner"}</span>
        {signerName && (
          <>
            <span className="columns is-size-2 is-family-monospace has-text-black has-text-weight-bold">
              {signerName}
            </span>
            <span className="columns is-size-6 has-text-weight-bold has-text-black">
              {signerAddr}
            </span>
          </>
        )}
        {!signerName && (
          <span className="columns is-size-3 is-family-monospace has-text-black has-text-weight-bold">
            {signerAddr}
          </span>
        )}
      </div>
    );
  };

  const getThresholdView = () => {
    return (
      <div className="pl-4 mb-4">
        <span className="columns">Signature Threshold</span>
        <span className="columns is-size-3 is-family-monospace has-text-black has-text-weight-bold">
          {newThreshold} of {safeOwners?.length} owners
        </span>
      </div>
    );
  };

  const getActionView = () => {
    switch (actionType) {
      case ACTION_TYPES.TRANSFER_TOKEN:
        return getTokenView();
      case ACTION_TYPES.TRANSFER_NFT:
        return getNFTView();
      case ACTION_TYPES.ADD_OWNER:
        return getOwnerView(true);
      case ACTION_TYPES.REMOVE_OWNER:
        return getOwnerView(false);
      case ACTION_TYPES.UPDATE_THRESHOLD:
        return getThresholdView();
      default:
        return <></>;
    }
  };

  return (
    <div className="p-5 has-text-grey">
      <div className="pb-4">{getActionView()}</div>
      <div className="column is-flex border-light-bottom pb-5">
        <span className="has-text-grey flex-1">Confirmations</span>
      </div>
      <div className="is-flex is-align-items-center mt-5">
        <button className="button flex-1 is-border mr-2" onClick={onReject}>
          Reject
        </button>
        <button className={"button flex-1 is-primary"} onClick={onApprove}>
          Approve
        </button>
      </div>
    </div>
  );
};
export default ActionRequired;
