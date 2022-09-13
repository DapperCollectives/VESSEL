import React from "react";
import { useClipboard } from "hooks";
import {
  formatAddress,
  getFlowscanUrlForContract,
  parseIdentifier,
} from "utils";
import { Copy } from "components/Svg";

const AssetTableView = ({ assets, emptyPlaceholder, onRemoveClick }) => {
  const clipboard = useClipboard();

  return (
    <div className="rounded-sm py-3 table-border">
      {assets && assets.length > 0 ? (
        assets.map((asset) => {
          const { contractName, contractAddress } = parseIdentifier(asset);
          const formattedAddress = formatAddress(contractAddress);

          return (
            <div className="mx-0 p-3 columns" key={contractName}>
              <div className="column">{contractName}</div>
              <div className="column has-text-weight-bold">
                {formattedAddress}
                <span
                  className="pointer"
                  onClick={() => clipboard.copy(formattedAddress)}
                >
                  <Copy className="mt-1 ml-1 pointer" />
                </span>
              </div>
              <a
                className="column button is-flex is-justify-content-end is-transparent"
                href={getFlowscanUrlForContract(contractAddress, contractName)}
                target="_blank"
                rel="noreferrer"
              >
                View on Flowscan
              </a>
              <button
                className="column button is-flex is-justify-content-end is-transparent"
                onClick={() => onRemoveClick(asset, contractName)}
              >
                Remove
              </button>
            </div>
          );
        })
      ) : (
        <div className="mx-0 p-3 has-text-centered">{emptyPlaceholder}</div>
      )}
    </div>
  );
};
export default AssetTableView;
