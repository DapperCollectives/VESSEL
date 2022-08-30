import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "contexts/Web3";
import { useClipboard } from "../hooks";
import { Copy, ArrowUp, OpenNewTab } from "../components/Svg";
import { getFlowscanUrlForTransaction } from "utils";
import { ASSET_TYPES } from "../constants/enums";
import { COIN_TYPE_TO_META, CONTRACT_NAME_TO_COIN_TYPE } from "../constants/maps";

const SuccessModal = ({ data, type, txID, onClose, safeName }) => {
    const { getNFTReference } = useContext(Web3Context);
    const clipboard = useClipboard();

    const [imageURI, setImageURI] = useState();

    useEffect(() => {
        if (type === ASSET_TYPES.NFT) {
            const getImageURL = async () => {
                const result = await getNFTReference(data.recipientAddr, data.nftID);
                setImageURI(result);
            };
            getImageURL().catch(console.error);
        }
    }, [type])

    function getNFTName(collectionId) {
        return collectionId.split(".")[2];
    }

    function getTokenName(vaultId) {
        const tokenName = vaultId.split(".")[2];
        return COIN_TYPE_TO_META[CONTRACT_NAME_TO_COIN_TYPE[tokenName]].displayName;
    }

    return (
        <div className="p-5 has-text-black has-text-left">
            <div className="pl-5 pr-5">
                <h4 className="pb-5 is-size-6 is-half modal-safe-name">{safeName}</h4>
                <h2 className="is-half modal-title">Success</h2>
            </div>

            <div className="ml-5 mr-5 p-4 success-modal-background">
                <button className="button flex-1 is-info">
                    Sent <ArrowUp className="ml-2 has-text-white" />
                </button>
                <div className="pl-4">
                    {type === ASSET_TYPES.NFT &&
                        <>
                            <img className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 success-modal-image" src={imageURI} />
                            <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-family-monospace is-size-5">
                                {getNFTName(data.collectionID)} #{data.nftID}
                            </span>
                        </>
                    }
                    {type === ASSET_TYPES.TOKEN &&
                        <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-5 is-family-monospace">
                            {data.amount} {getTokenName(data.vaultID)}
                        </span>
                    }
                    <span className="columns is-vcentered is-multiline is-mobile mt-5 mb-1">
                        Sent to&nbsp;
                        <span className="is-underlined">{data.recipientAddr}</span>
                        <a onClick={() => clipboard.copy(data.recipientAddr)}>
                            <Copy className="mt-1 ml-2 pointer" />
                        </a>
                    </span>
                </div>
            </div>
            <div className="pl-5 pr-5 is-flex is-align-items-center mt-5">
                <button
                    className="button flex-1 p-4 mr-2 rounded-sm"
                    onClick={onClose}
                >
                    Done
                </button>
                <a
                    className="button is-flowscan flex-2 p-4 rounded-sm"
                    href={getFlowscanUrlForTransaction(txID)}
                    target="_blank"
                >
                    View on Flowscan
                    &nbsp;
                    <OpenNewTab />
                </a>
            </div>
        </div >
    );
}

export default SuccessModal;