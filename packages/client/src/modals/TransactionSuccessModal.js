import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "contexts/Web3";
import { useClipboard, useContacts } from "../hooks";
import { Copy, ArrowUp, OpenNewTab } from "../components/Svg";
import { getFlowscanUrlForTransaction, formatAddress, getTokenMeta, getNFTMeta } from "utils";
import { ACTION_TYPES } from "../constants/enums";

const TransactionSuccessModal = ({ actionData, txID, onClose, safeName, safeAddress }) => {
    const { getNFTReference } = useContext(Web3Context);
    const clipboard = useClipboard();
    const [image, setImage] = useState();
    const { contacts } = useContacts(safeAddress);

    const { recipient, nftId, collectionId, vaultId, tokenAmount } = actionData;
    const { displayName, icon } = getTokenMeta(vaultId) || {};
    const { NFTName, NFTAddress } = getNFTMeta(collectionId) || {};
    const { name: imageName, imageURI } = image || {};

    const actionType = actionData.type;

    useEffect(() => {
        if (actionType === ACTION_TYPES.TRANSFER_NFT) {
            const getImageURL = async () => {
                const result = await getNFTReference(NFTName, formatAddress(NFTAddress), recipient, nftId);
                setImage(result);
            };
            getImageURL().catch(console.error);
        }
    }, [actionType, NFTName, NFTAddress, nftId, recipient, getNFTReference])

    function getSafeContactName(address) {
        const contact = contacts.find(contact => contact.address === address);
        return contact?.name;
    }

    return (
        <div className="p-5 has-text-black has-text-left">
            <div className="p-5 success-modal-background">
                <button className="button flex-1 is-info mb-1">
                    Sent <ArrowUp className="ml-2 has-text-white" />
                </button>
                <div className="pl-4">
                    {actionType === ACTION_TYPES.TRANSFER_NFT &&
                        <>
                            <img className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 success-modal-image" src={imageURI} alt={imageName} />
                            <span className="columns is-vcentered is-multiline is-mobile mr-2 is-size-2 is-family-monospace">
                                #{nftId}
                            </span>
                            <span className="columns is-vcentered is-multiline is-mobile is-size-6 has-text-weight-bold">
                                {NFTName}
                            </span>
                        </>
                    }
                    {actionType === ACTION_TYPES.TRANSFER_TOKEN &&
                        <>
                            <span className="columns is-vcentered is-multiline is-mobile mr-2 mt-2 is-size-2 is-family-monospace">
                                {Number(tokenAmount)}
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
                    <div>
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
                    <div>
                        <span className="has-text-weight-bold">
                            {getSafeContactName(recipient)}
                        </span>
                        <div >
                            <span className="has-text-grey">
                                {recipient}
                            </span>
                            <span className="pointer" onClick={() => clipboard.copy(recipient)}>
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

export default TransactionSuccessModal;