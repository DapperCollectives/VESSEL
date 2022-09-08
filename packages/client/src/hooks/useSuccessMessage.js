import { useModalContext } from "contexts";
import { TransactionSuccessModal } from "modals";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();

    const showTransactionSuccessModal = (action, safeName, safeAddress) => {
        const actionData = action.data.actionView;
        openModal(
            <TransactionSuccessModal
                safeName={safeName}
                safeAddress={safeAddress}
                actionData={actionData}
                txID={action.transactionId}
                onClose={closeModal}
            />,
            {
                headerTitle: "Success",
            }
        );
    }

    return { showTransactionSuccessModal };
}
