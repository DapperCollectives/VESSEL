import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { formatAddress } from "utils";

import { Web3Context } from "contexts/Web3";
import { Plus } from "components/Svg";
import AddVault from "./AddVault";
import AddCollection from "./AddCollection";
import AssetTableView from "./AssetTableView";

const Assets = ({ treasury, proposeAddVault, proposeAddCollection }) => {
  const { address } = treasury;
  const { openModal, closeModal } = useModalContext();
  const history = useHistory();

  const { getTreasuryCollections, getTreasuryVaults, vaults, NFTs } = useContext(Web3Context);

  useEffect(() => {
    if (!address) {
      return;
    }

    const getCollections = async () => {
      await getTreasuryCollections(address);
    };

    const getVaults = async () => {
      await getTreasuryVaults(address);
    }
    getCollections();
    getVaults();
    // eslint-disable-next-line
  }, [address]);

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
    <div>
      <div className="px-0 mt-5 columns">
        <h4 className="is-size-5 column">Token Vaults</h4>
        <button
          className="button is-add mr-3"
          onClick={openAddVaultModal}
        >
          Add Token Vault
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      {vaults && vaults[address] &&
        <AssetTableView assets={Object.values(vaults[address])} />
      }

      <div className="p-0 mt-5 columns">
        <h4 className="is-size-5 column">NFT Collections</h4>
        <button
          className="button is-add mr-3"
          onClick={openAddCollectionModal}
        >
          Add NFT Collection
          <Plus style={{ position: "relative", left: 5 }} />
        </button>
      </div>
      {NFTs && NFTs[address] &&
        <AssetTableView assets={Object.keys(NFTs[address])} />
      }
    </div>
  );
};
export default Assets;
