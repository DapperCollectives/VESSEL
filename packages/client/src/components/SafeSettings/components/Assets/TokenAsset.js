import React, { forwardRef, useEffect } from 'react';
import { useModalContext } from 'contexts';
import { useErrorMessage } from 'hooks';
import { formatAddress, getTokenMeta } from 'utils';
import Svg from 'library/Svg';
import AddVault from './AddVault';
import AssetTableView from './AssetTableView';
import RemoveAsset from './RemoveAsset';

const TokenAsset = (
  {
    userAddr,
    treasury,
    vaults,
    getTreasuryVaults,
    addVault,
    removeVault,
    refreshTreasury,
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
    const getVaults = async () => {
      await getTreasuryVaults(address);
    };
    getVaults();
    // eslint-disable-next-line
  }, [userAddr]);

  const onAddVaultSubmit = async (form) => {
    try {
      await addVault(form.selectedCoinType);
      await refreshTreasury();
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const onRemoveVaultSubmit = async (identifier) => {
    try {
      await removeVault(identifier);
      await refreshTreasury();
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
      { headerTitle: 'Add Token Vault' }
    );
  };

  const openRemoveVaultModal = (identifier) => {
    const { displayName, tokenAddress } = getTokenMeta(identifier);
    openModal(
      <RemoveAsset
        name={displayName}
        address={formatAddress(tokenAddress)}
        explanation="This is only possible if your balance for this token is 0."
        onCancel={() => closeModal()}
        onNext={() => onRemoveVaultSubmit(identifier)}
      />,
      { headerTitle: 'Remove Token Vault' }
    );
  };

  return (
    <div>
      <div
        ref={ref}
        className="column p-0 mt-5 is-flex is-full is-justify-content-space-between"
      >
        <h2>Token Vaults</h2>
        <button
          className="button is-secondary is-small with-icon"
          onClick={openAddVaultModal}
        >
          Add Token Vault
          <Svg name="Plus" />
        </button>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        <AssetTableView
          assets={vaults[address] ?? []}
          emptyPlaceholder="You don't have any Token Vaults yet."
          onRemoveClick={openRemoveVaultModal}
        />
      </div>
    </div>
  );
};
export default forwardRef(TokenAsset);
