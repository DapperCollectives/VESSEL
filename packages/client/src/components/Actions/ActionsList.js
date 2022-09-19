import React, { useContext } from "react";
import { formatActionString } from "utils";
import { SIGNER_RESPONSES } from "constants/enums";
import { useModalContext } from "contexts";
import { Web3Context } from "contexts/Web3";
import ActionRequired from "./components/ActionRequired";
import { useErrorMessage } from "hooks";

function ActionsList({ actions = [], onSign, onReject, onConfirm, safeData }) {
  const ActionComponents = [];

  const { getActionView } = useContext(Web3Context);
  const { showErrorModal } = useErrorMessage();
  const { openModal, closeModal } = useModalContext();

  const onSignAction = async (action) => {
    try {
      await onSign(action);
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const onRejectAction = async (action) => {
    try {
      await onReject(action);
      closeModal();
    } catch (error) {
      showErrorModal(error);
    }
  };

  const openSignRejectModal = async (action) => {
    const view = await getActionView(safeData.address, action.uuid);
    openModal(
      <ActionRequired
        safeData={safeData}
        actionView={view}
        confirmations={action.signerResponses}
        onReject={() => onRejectAction(action)}
        onApprove={() => onSignAction(action)}
      />,
      { headerTitle: "Action Required" }
    );
  };

  if (!actions.length) {
    ActionComponents.push(
      <div
        className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
        style={{ minHeight: 175 }}
        key="no-transactions"
      >
        No pending transactions
      </div>
    );
  } else {
    actions.forEach((action, idx) => {
      const borderClass = idx < actions.length - 1 ? "border-light-top" : ``;
      const totalSigned = Object.values(action.signerResponses).filter(
        (x) => x === SIGNER_RESPONSES.APPROVED
      ).length;
      const confirmReady = totalSigned >= safeData.threshold;
      const background = confirmReady ? "#FF8A00" : "#FF0000";
      const actionPrompt = confirmReady
        ? "Confirm Transaction"
        : "Signature Required";
      const actionCopy = confirmReady ? "Confirm" : "Sign";
      const actionFn = confirmReady ? onConfirm : openSignRejectModal;
      ActionComponents.push(
        <div
          key={action.uuid}
          className={`p-5 ${borderClass} is-flex column is-full`}
        >
          <div className="pr-5">{action.uuid}</div>
          <div className="flex-1">{formatActionString(action.intent)}</div>
          <div className="pl-6" style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                left: 25,
                top: 4,
                background,
              }}
            />
            {actionPrompt}
          </div>
          <div className="pl-6" style={{ position: "relative" }}>
            {totalSigned} of {safeData.threshold} signatures
          </div>
          <button
            className="button is-tertiary ml-3"
            onClick={() => actionFn(action)}
          >
            {actionCopy}
          </button>
        </div>
      );
    });
  }

  return (
    <div className="column p-0 mt-4 mb-5 is-flex is-full border-light has-shadow rounded-sm is-flex-wrap-wrap">
      {ActionComponents}
    </div>
  );
}

export default ActionsList;
