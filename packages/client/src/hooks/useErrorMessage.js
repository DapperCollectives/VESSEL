import { useModalContext } from "contexts";
import { ErrorModal } from "modals";
import { useEffect, useState } from "react";

export default function useErrorMessage() {
    const { openModal, closeModal } = useModalContext();
    const [error, setError] = useState();

    const showErrorModal = (error) => {
        setError(error);
    }

    const closeErrorModal = () => {
        setError();
        closeModal();
    }

    const extractError = (error) => {
        if (typeof error == "string" && error.includes("\n") && error.includes(": ")) {
            const errorMessage = error.split("\n")[1];
            return errorMessage.split(": ")[2] || errorMessage.split(": ")[1];
        }
        return "Unknown error occured.";
    }

    useEffect(() => {
        if (error) {
            const errorMessage = extractError(error);
            openModal(
                <ErrorModal error={errorMessage} onClose={closeErrorModal} />
            );
        }
        // eslint-disable-next-line
    }, [error])

    return { showErrorModal };
}
