import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { formatAddress, getFlowscanUrlForContract } from "utils";
import { useClipboard } from "../../../../hooks";

import { Web3Context } from "contexts/Web3";
import { Plus, Copy } from "components/Svg";
import AddVault from "./AddVault";
import AddCollection from "./AddCollection";

const Assets = ({ treasury, proposeAddVault, proposeAddCollection }) => {
  const { address } = treasury;
  const { openModal, closeModal } = useModalContext();
  const history = useHistory();
  const clipboard = useClipboard();

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
        <div className="border-light rounded-sm py-3 table-border">
          {Object.values(vaults[address]).map(vault => {
            const address = vault.split(".")[1];
            const formattedAddress = formatAddress(address);
            const name = vault.split(".")[2];
            return (
              <div className="mx-0 p-3 columns">
                <div className="column">{name}</div>
                <div className="column has-text-weight-bold">
                  {formattedAddress}
                  <span className="pointer" onClick={() => clipboard.copy(formattedAddress)}>
                    <Copy className="mt-1 ml-2 pointer" />
                  </span></div>
                <a
                  className="column is-flex is-justify-content-end has-text-purple button border-none"
                  href={getFlowscanUrlForContract(address, name)}
                  target="_blank"
                  rel="noreferrer">
                  View on Flowscan
                </a>
                <button className="column is-flex is-justify-content-end has-text-purple button border-none">
                  Remove
                </button>
              </div>
            )
          })}
        </div>
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
        <div className="border-light rounded-sm py-3 table-border">
          {Object.keys(NFTs[address]).map(collection => {
            const address = collection.split(".")[1];
            const formattedAddress = formatAddress(address);
            const name = collection.split(".")[2];
            return (
              <div className="mx-0 p-3 columns">
                <div className="column">{name}</div>
                <div className="column has-text-weight-bold">
                  {formattedAddress}
                  <span className="pointer" onClick={() => clipboard.copy(formattedAddress)}>
                    <Copy className="mt-1 ml-2 pointer" />
                  </span>
                </div>
                <a
                  className="column is-flex is-justify-content-end has-text-purple button border-none"
                  href={getFlowscanUrlForContract(address, name)}
                  target="_blank"
                  rel="noreferrer">
                  View on Flowscan
                </a>
                <button className="column is-flex is-justify-content-end has-text-purple button border-none">
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
};
export default Assets;
