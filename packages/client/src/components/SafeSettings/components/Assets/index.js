import React from "react";
import { useModalContext } from "contexts";
import { formatAddress, getNFTMeta, getTokenMeta } from "utils";
import { useErrorMessage } from "hooks";

import { Plus } from "components/Svg";
import AddVault from "./AddVault";
import AddCollection from "./AddCollection";
import AssetTableView from "./AssetTableView";
import RemoveVault from "./RemoveVault";
import RemoveCollection from "./RemoveCollection";

const Assets = ({
  treasury,
  vaults,
  NFTs,
  addVault,
  addCollection,
  removeVault,
  removeCollection,
}) => {
  const { address } = treasury;
  const { openModal, closeModal } = useModalContext();
  const { showErrorModal } = useErrorMessage();

  const onAddVaultSubmit = async (form) => {
    try {
      await addVault(form.coinType);
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const onAddCollectionSubmit = async (form) => {
    try {
      await addCollection(form.contractName, formatAddress(form.address));
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const onRemoveVaultSubmit = async (identifier) => {
    try {
      await removeVault(identifier);
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

  const openAddVaultModal = () => {
    openModal(
      <AddVault
        address={address}
        onCancel={() => closeModal()}
        onNext={onAddVaultSubmit}
      />
    );
  };

  const openAddCollectionModal = () => {
    openModal(
      <AddCollection
        onCancel={() => closeModal()}
        onNext={onAddCollectionSubmit}
      />
    );
  };

  const openRemoveVaultModal = (identifier) => {
    const { displayName, tokenAddress } = getTokenMeta(identifier);
    openModal(
      <RemoveVault
        name={displayName}
        address={formatAddress(tokenAddress)}
        onCancel={() => closeModal()}
        onNext={() => onRemoveVaultSubmit(identifier)}
      />
    );
  };

  const openRemoveCollectionModal = (identifier) => {
    const { NFTName, NFTAddress } = getNFTMeta(identifier);
    openModal(
      <RemoveCollection
        name={NFTName}
        address={formatAddress(NFTAddress)}
        onCancel={() => closeModal()}
        onNext={() => onRemoveCollectionSubmit(identifier)}
      />
    );
  };

  return (
    <div>
      <div className="px-0 mt-5 columns">
        <h4 className="is-size-5 column">Token Vaults</h4>
        <button className="button is-add mr-3" onClick={openAddVaultModal}>
          Add Token Vault
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      {vaults && vaults[address] && (
        <AssetTableView
          assets={Object.values(vaults[address])}
          emptyPlaceholder="You don't have any Token Vaults yet."
          onRemoveClick={openRemoveVaultModal}
        />
      )}

      <div className="p-0 mt-5 columns">
        <h4 className="is-size-5 column">NFT Collections</h4>
        <button className="button is-add mr-3" onClick={openAddCollectionModal}>
          Add NFT Collection
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      {NFTs && NFTs[address] && (
        <AssetTableView
          assets={Object.keys(NFTs[address])}
          emptyPlaceholder="You don't have any NFT Collections yet."
          onRemoveClick={openRemoveCollectionModal}
        />
      )}
    </div>
  );
};
export default Assets;
