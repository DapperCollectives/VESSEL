import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "contexts/Web3";
import { useClipboard } from "../hooks";
import { Copy, ArrowUp, OpenNewTab, Close } from "../components/Svg";
import { getFlowscanUrlForTransaction } from "utils";
import { ASSET_TYPES } from "../constants/enums";
import { COIN_TYPE_TO_META, CONTRACT_NAME_TO_COIN_TYPE } from "../constants/maps";

const SuccessModal = ({ actionData, actionType, txID, onClose, safeName, safeAddress, safeOwners }) => {
    const { getNFTReference } = useContext(Web3Context);
    const clipboard = useClipboard();

    const { recipientAddr, nftID, collectionID, vaultID, amount } = actionData;
    const { displayName, icon } = getTokenMeta(vaultID) || {};

    const [image, setImage] = useState();
    const { name: imageName, imageURI } = image || {};

    useEffect(() => {
        if (actionType === ASSET_TYPES.NFT) {
            const getImageURL = async () => {
                const result = await getNFTReference(recipientAddr, nftID);
                setImage(result);
            };
            getImageURL().catch(console.error);
        }
    }, [actionType, nftID, recipientAddr, getNFTReference])

    function getNFTName(collectionId) {
        return collectionId.split(".")[2];
    }

    function getTokenMeta(vaultId) {
        if (vaultId) {
            const tokenName = vaultId.split(".")[2];
            return COIN_TYPE_TO_META[CONTRACT_NAME_TO_COIN_TYPE[tokenName]];
        }
    }

    function getSafeOwnerName(address) {
        const owner = safeOwners.filter(owner => owner.address === address);
        return owner && owner[0].name;
    }

    return (
        <div className="p-5 has-text-black has-text-left">
            <div className="border-light-bottom columns is-vcentered is-multiline is-mobile">
                <h2 className="pb-4 is-size-5 has-text-black column">Success</h2>
                <span className="pointer" onClick={onClose}>
                    <Close className="mr-4" />
                </span>
            </div>

            <div className="mt-4 p-5 success-modal-background">
                <button className="button flex-1 is-info mb-1">
                    Sent <ArrowUp className="ml-2 has-text-white" />
                </button>
                <div className="pl-4">
                    {actionType === ASSET_TYPES.NFT &&
                        <>
                            <img className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 success-modal-image" src={imageURI} alt={imageName} />
                            <span className="columns is-vcentered is-multiline is-mobile mr-2 is-size-2 is-family-monospace">
                                #{nftID}
                            </span>
                            <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
                                {getNFTName(collectionID)}
                            </span>
                        </>
                    }
                    {actionType === ASSET_TYPES.TOKEN &&
                        <>
                            <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-2 is-family-monospace">
                                {Number(amount)}
                            </span>
                            <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
                                {icon} &nbsp; {displayName}
                            </span>
                        </>
                    }
                </div>
            </div>
            <div className="mt-4 border-light-top">
                <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
                    <span className="flex-1 has-text-grey">Sent From</span>
                    &nbsp;
                    <div className="flex-1" style={{ position: "relative" }}>
                        <span className="has-text-weight-bold">
                            {safeName}
                        </span>
                        <div>
                            <span className="has-text-grey">
                                {safeAddress}
                            </span>
                            <span className="pointer" onClick={() => clipboard.copy(safeAddress)}>
                                <Copy className="mt-1 ml-2 pointer" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
                    <span className="has-text-grey flex-1">Sent To</span>
                    &nbsp;
                    <div className="flex-1" style={{ position: "relative" }}>
                        <span className="has-text-weight-bold">
                            {getSafeOwnerName(recipientAddr)}
                        </span>
                        <div >
                            <span className="has-text-grey">
                                {recipientAddr}
                            </span>
                            <span className="pointer" onClick={() => clipboard.copy(recipientAddr)}>
                                <Copy className="mt-1 ml-2 pointer" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="is-flex is-align-items-center mt-5">
                <a
                    className="button flex-1 p-4 mr-2 rounded-sm"
                    href={getFlowscanUrlForTransaction(txID)}
                    target="_blank"
                    rel="noreferrer"
                >
                    Flowscan
                    &nbsp;
                    <OpenNewTab />
                </a>
                <button
                    className="button flex-1 p-4 rounded-sm is-done"
                    onClick={onClose}
                >
                    Done
                </button>
            </div>
        </div >
    );
}

export default SuccessModal;