import { useEffect, useState } from "react";
import { useModalContext } from "contexts";
import { SuccessModal } from "modals";
import { ASSET_TYPES, ACTION_TYPES } from "../constants/enums";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();
    const [data, setData] = useState();
    const [type, setType] = useState();
    const [safeName, setSafeName] = useState();
    const [safeAddress, setSafeAddress] = useState();
    const [transactionId, setTransactionId] = useState();

    const showSuccessTransactionModal = (action, safeName, safeAddress) => {
        const actionData = action.data.actionView;
        setType(getActionType(actionData.type));
        setData(actionData);
        setTransactionId(action.transactionId);
        setSafeName(safeName);
        setSafeAddress(safeAddress);
    }

    const getActionType = (type) => {
        switch (type) {
            case ACTION_TYPES.TRANSFER_NFT:
                return ASSET_TYPES.NFT;
            case ACTION_TYPES.TRANSFER_TOKEN:
                return ASSET_TYPES.TOKEN;
            default:
                return undefined;
        }
    }

    const closeSuccessModal = () => {
        setData();
        closeModal();
    }

    useEffect(() => {
        if (type && data && safeName && safeAddress) {
            openModal(
                <SuccessModal
                    safeName={safeName}
                    safeAddress={safeAddress}
                    actionData={data}
                    actionType={type}
                    txID={transactionId}
                    onClose={closeSuccessModal}
                />,
                {
                    headerTitle: "Success",
                }
            );
        }
        // eslint-disable-next-line
    }, [data, safeName, safeAddress])

    return { showSuccessTransactionModal };
}
