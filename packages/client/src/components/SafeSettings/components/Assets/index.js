import React from "react";
import { useModalContext } from "contexts";
import { formatAddress, getTokenMeta, parseIdentifier } from "utils";
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
      />,
      { headerTitle: "Add Token Vault" }
    );
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

  const openRemoveVaultModal = (identifier) => {
    const { displayName, tokenAddress } = getTokenMeta(identifier);
    openModal(
      <RemoveVault
        name={displayName}
        address={formatAddress(tokenAddress)}
        onCancel={() => closeModal()}
        onNext={() => onRemoveVaultSubmit(identifier)}
      />,
      { headerTitle: "Remove Token Vault" }
    );
  };

  const openRemoveCollectionModal = (identifier) => {
    const { contractName, contractAddress } = parseIdentifier(identifier);
    openModal(
      <RemoveCollection
        name={contractName}
        address={formatAddress(contractAddress)}
        onCancel={() => closeModal()}
        onNext={() => onRemoveCollectionSubmit(identifier)}
      />,
      { headerTitle: "Remove NFT Collection" }
    );
  };

  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full is-justify-content-space-between">
        <h4 className="is-size-5">Token Vaults</h4>
        <button
          className="button is-secondary is-small with-icon"
          onClick={openAddVaultModal}
        >
          Add Token Vault
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {vaults && vaults[address] && (
          <AssetTableView
            assets={Object.values(vaults[address])}
            emptyPlaceholder="You don't have any Token Vaults yet."
            onRemoveClick={openRemoveVaultModal}
          />
        )}
      </div>

      <div className="column p-0 mt-5 is-flex is-full is-justify-content-space-between">
        <h4 className="is-size-5">NFT Collections</h4>
        <button
          className="button is-secondary is-small with-icon"
          onClick={openAddCollectionModal}
        >
          Add NFT Collection
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {NFTs && NFTs[address] && (
          <AssetTableView
            assets={Object.keys(NFTs[address])}
            emptyPlaceholder="You don't have any NFT Collections yet."
            onRemoveClick={openRemoveCollectionModal}
          />
        )}
      </div>
    </div>
  );
};
export default Assets;
