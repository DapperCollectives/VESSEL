import React from "react";
import { useModalContext } from "contexts";
import { useHistory } from "react-router-dom";
import { formatAddress } from "utils";
import AddVault from "./AddVault";
import AddCollection from "./AddCollection";
import Svg from "library/Svg";
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
        className="button mt-4 is-full p-4 border-light is-align-self-flex-end"
        onClick={openAddVaultModal}
      >
        Add Vault
        <Svg name="Plus" style={{ position: "relative", left: 5 }} />
      </button>
      <button
        className="button mt-4 is-full p-4 border-light is-align-self-flex-end"
        onClick={openAddCollectionModal}
      >
        Add Collection
        <Svg name="Plus" style={{ position: "relative", left: 5 }} />
      </button>
    </div>
  );
};
export default Assets;
