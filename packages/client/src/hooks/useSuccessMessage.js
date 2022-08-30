import { useEffect, useState } from "react";
import { useModalContext } from "contexts";
import { SuccessModal } from "modals";
import { ASSET_TYPES } from "../constants/enums";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();
    const [data, setData] = useState();
    const [type, setType] = useState();
    const [safeName, setSafeName] = useState();
    const [safeAddress, setSafeAddress] = useState();
    const [safeOwners, setSafeOwners] = useState();
    const [transactionId, setTransactionId] = useState();

    const showSuccessModal = (action, safeName, safeAddress, safeOwners) => {
        const type = getActionType(action.type.split(".")[3]);
        setType(type);
        setData(action.data);
        setTransactionId(action.transactionId);
        setSafeName(safeName);
        setSafeAddress(safeAddress);
        setSafeOwners(safeOwners);
    }

    const getActionType = (type) => {
        switch (type) {
            case "TransferNFTToAccountActionExecuted":
                return ASSET_TYPES.NFT;
            case "TransferTokenToAccountActionExecuted":
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
        if (type && data && safeName && safeOwners) {
            openModal(
                <SuccessModal safeName={safeName} safeAddress={safeAddress} safeOwners={safeOwners} data={data} type={type} txID={transactionId} onClose={closeSuccessModal} />
            );
        }
        // eslint-disable-next-line
    }, [data, safeName, safeOwners])

    return { showSuccessModal };
}
