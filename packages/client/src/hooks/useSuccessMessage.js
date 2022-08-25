import { useModalContext } from "contexts";
import { SuccessModal } from "modals";
import { useEffect, useState } from "react";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();
    const [data, setData] = useState();
    const [type, setType] = useState();
    const [safeName, setSafeName] = useState();

    const showSuccessModal = (action, safeName) => {
        const type = getActionType(action.type.split(".")[3]);
        setType(type);
        setData(action.data);
        setSafeName(safeName);
    }

    const getActionType = (type) => {
        switch (type) {
            case "TransferNFTToAccountActionExecuted":
                return "NFT";
            case "TransferTokenToAccountActionExecuted":
                return "FT";
            default:
                return "other";
        }
    }

    const closeSuccessModal = () => {
        setData();
        closeModal();
    }

    useEffect(() => {
        if (data) {
            openModal(
                <SuccessModal safeName={safeName} data={data} type={type} onClose={closeSuccessModal} />
            );
        }
        // eslint-disable-next-line
    }, [data])

    return { showSuccessModal };
}
