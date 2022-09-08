import { useModalContext } from "contexts";
import { TransactionSuccessModal } from "modals";
import { ASSET_TYPES, ACTION_TYPES } from "../constants/enums";

export default function useSuccessMessage() {
    const { openModal, closeModal } = useModalContext();

    const showSuccessTransactionModal = (action, safeName, safeAddress) => {
        const actionData = action.data.actionView;
        openModal(
            <TransactionSuccessModal
                safeName={safeName}
                safeAddress={safeAddress}
                actionData={actionData}
                actionType={getActionType(actionData.type)}
                txID={action.transactionId}
                onClose={closeSuccessModal}
            />,
            {
                headerTitle: "Success",
            }
        );
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
        closeModal();
    }

    return { showSuccessTransactionModal };
}
