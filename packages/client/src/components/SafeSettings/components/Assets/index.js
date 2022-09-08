import React from "react";
import { useModalContext } from "contexts";
import { useHistory } from "react-router-dom";
import { Plus } from "components/Svg";
import { formatAddress } from "utils";
import AddVault from "./AddVault";
import AddCollection from "./AddCollection";
const Assets = ({ treasury, proposeAddVault, proposeAddCollection }) => {
  const { address } = treasury;
  const { openModal, closeModal } = useModalContext();
  const history = useHistory();
  const onAddVaultSubmit = async (form) => {
    await proposeAddVault(form.coinType);

    closeModal();
    history.push(`/safe/${address}`);
  };
  const onAddCollectionSubmit = async (form) => {
    await proposeAddCollection(form.contractName, formatAddress(form.address));

    closeModal();
    history.push(`/safe/${address}`);
  };
  const openAddVaultModal = () => {
    openModal(
      <AddVault onCancel={() => closeModal()} onNext={onAddVaultSubmit} />
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
  return (
    <div className="p-0 mt-5">
      <h4 className="is-size-5">Assets</h4>
      <button
        className="button mt-4 is-full is-secondary is-align-self-flex-end"
        onClick={openAddVaultModal}
      >
        Add Vault
        <Plus style={{ position: "relative", left: 5 }} />
      </button>
      <button
        className="button mt-4 is-full is-secondary is-align-self-flex-end"
        onClick={openAddCollectionModal}
      >
        Add Collection
        <Plus style={{ position: "relative", left: 5 }} />
      </button>
    </div>
  );
};
export default Assets;
