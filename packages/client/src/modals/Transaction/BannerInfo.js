import React, { useContext, useEffect, useState } from 'react';
import { Web3Context } from 'contexts/Web3';
import { ACTION_TYPES } from 'constants/enums';
import {
  formatAddress,
  getNameByAddress,
  getTokenMeta,
  parseIdentifier,
} from 'utils';
import Svg from 'library/Svg';

const BannerInfo = ({
  className = '',
  actionData = {},
  contacts = {},
  signers = [],
}) => {
  const { getAccountNFTReference } = useContext(Web3Context);
  const [nftMeta, setNFTMeta] = useState();
  const {
    recipient,
    nftId,
    collectionId,
    vaultId,
    tokenAmount,
    signerAddr,
    newThreshold,
  } = actionData;
  const { displayName, tokenType } = getTokenMeta(vaultId);
  const { contractName: NFTName, contractAddress: NFTAddress } =
    parseIdentifier(collectionId);
  const { name: imageName, imageURI, thumbnail } = nftMeta || {};
  const actionType = actionData.type;
  const image = imageURI ?? thumbnail;

  useEffect(() => {
    if (actionType === ACTION_TYPES.TRANSFER_NFT) {
      const getNFTMeta = async () => {
        const result = await getAccountNFTReference(
          NFTName,
          formatAddress(NFTAddress),
          recipient,
          nftId
        );
        setNFTMeta(result ?? {});
      };
      getNFTMeta().catch(console.error);
    }
  }, [
    actionType,
    NFTName,
    NFTAddress,
    nftId,
    recipient,
    getAccountNFTReference,
  ]);

  const contactName = getNameByAddress(contacts, signerAddr);
  const approvedSigners = Object.values(signers).filter(
    (status) => status === 'approved'
  ).length;

  return (
    <div className={className}>
      {actionType === ACTION_TYPES.TRANSFER_NFT && (
        <>
          {image && (
            <img
              className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 success-modal-image"
              src={image}
              alt={image}
            />
          )}
          <span className="columns is-vcentered is-multiline is-mobile mr-2 is-size-4 is-family-monospace">
            #{nftId}
          </span>
          <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
            {NFTName}
          </span>
        </>
      )}
      {actionType === ACTION_TYPES.TRANSFER_TOKEN && (
        <>
          <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-4 is-family-monospace">
            {Number(tokenAmount).toLocaleString()}
          </span>
          <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
            <Svg name={tokenType} /> &nbsp;
            {displayName}
          </span>
        </>
      )}
      {(actionType === ACTION_TYPES.ADD_SIGNER_UPDATE_THRESHOLD ||
        actionType === ACTION_TYPES.REMOVE_SIGNER_UPDATE_THRESHOLD) && (
        <>
          <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-4 is-family-monospace">
            <b>{contactName}</b>
          </span>
          {contactName !== signerAddr && (
            <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
              {signerAddr}
            </span>
          )}
        </>
      )}
      {actionType === ACTION_TYPES.UPDATE_THRESHOLD && (
        <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-4 is-family-monospace">
          <b>
            {approvedSigners} of {newThreshold} owners
          </b>
        </span>
      )}
    </div>
  );
};

export default BannerInfo;
