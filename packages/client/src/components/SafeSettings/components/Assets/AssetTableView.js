import React from "react";
import { useClipboard } from "hooks";
import { formatAddress, getFlowscanUrlForContract } from "utils";
import { Copy } from "components/Svg";

const AssetTableView = ({ assets, emptyPlaceholder, onRemoveClick }) => {
    const clipboard = useClipboard();

    return (
        <div className="border-light rounded-sm py-3 table-border">
            {
                assets.length > 0 ?
                    assets.map(asset => {
                        const address = asset?.split(".")[1];
                        const name = asset?.split(".")[2];
                        const formattedAddress = formatAddress(address);

                        return (
                            <div className="mx-0 p-3 columns" key={name}>
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
                                <button className="column is-flex is-justify-content-end has-text-purple button border-none" onClick={() => onRemoveClick(asset, name)}>
                                    Remove
                                </button>
                            </div>
                        )
                    }) :
                    <div className="mx-0 p-3 has-text-centered">
                        {emptyPlaceholder}
                    </div>
            }
        </div>
    );
};
export default AssetTableView;