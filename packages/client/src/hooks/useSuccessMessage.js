import { useModalContext } from "contexts";
import { TransactionSuccessModal } from "modals";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();

    const showSuccessTransactionModal = (action, safeName, safeAddress) => {
        const actionData = action.data.actionView;
        openModal(
            <TransactionSuccessModal
                safeName={safeName}
                safeAddress={safeAddress}
                actionData={actionData}
                actionType={actionData.type}
                txID={action.transactionId}
                onClose={closeSuccessModal}
            />,
            {
                headerTitle: "Success",
            }
        );
    }

    const closeSuccessModal = () => {
        closeModal();
    }

    return { showSuccessTransactionModal };
}
