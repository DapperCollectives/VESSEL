import React, { useEffect, forwardRef } from "react";
import { useModalContext } from "contexts";
import { formatAddress, parseIdentifier } from "utils";
import { useErrorMessage } from "hooks";
import AddCollection from "./AddCollection";
import Svg from "library/Svg";
import AssetTableView from "./AssetTableView";
import RemoveAsset from "./RemoveAsset";

const NFTAsset = (
  {
    userAddr,
    treasury,
    NFTs,
    getTreasuryCollections,
    addCollection,
    removeCollection,
  },
  ref
) => {
  const { address } = treasury;
  const { openModal, closeModal } = useModalContext();
  const { showErrorModal } = useErrorMessage();

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

  const onAddCollectionSubmit = async (form) => {
    try {
      await addCollection(form.contractName, formatAddress(form.address));
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const onRemoveCollectionSubmit = async (identifier) => {
    try {
      await removeCollection(identifier);
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const openAddCollectionModal = () => {
    openModal(
      <AddCollection
        onCancel={() => closeModal()}
        onNext={onAddCollectionSubmit}
      />,
      { headerTitle: "Add NFT Collection" }
    );
  };

  const openRemoveCollectionModal = (identifier) => {
    const { contractName, contractAddress } = parseIdentifier(identifier);
    openModal(
      <RemoveAsset
        name={contractName}
        address={formatAddress(contractAddress)}
        explanation={
          "This is only possible if you don’t have any NFT from this collection in your treasury."
        }
        onCancel={() => closeModal()}
        onNext={() => onRemoveCollectionSubmit(identifier)}
      />,
      { headerTitle: "Remove NFT Collection" }
    );
  };

  return (
    <div ref={ref}>
      <div className="column p-0 mt-5 is-flex is-full is-justify-content-space-between">
        <h2>NFT Collections</h2>
        <button
          className="button is-secondary is-small with-icon"
          onClick={openAddCollectionModal}
        >
          Add NFT Collection
          <Svg name="Plus" />
        </button>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        <AssetTableView
          assets={Object.keys(NFTs[address] ?? {})}
          emptyPlaceholder="You don't have any NFT Collections yet."
          onRemoveClick={openRemoveCollectionModal}
        />
      </div>
    </div>
  );
};
export default forwardRef(NFTAsset);
