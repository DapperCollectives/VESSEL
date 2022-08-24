import { useModalContext } from "contexts";
import { ErrorModal } from "modals";
import { useEffect, useState } from "react";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();
    const [message, setMessage] = useState();

    const showSuccessModal = (action) => {
        const type = getActionType(action.type.split(".")[3]);

        setMessage(JSON.stringify(action.data));
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
        setMessage();
        closeModal();
    }

    useEffect(() => {
        if (message) {
            openModal(
                <ErrorModal error={message} onClose={closeSuccessModal} />
            );
        }
        // eslint-disable-next-line
    }, [message])

    return { showSuccessModal };
}
