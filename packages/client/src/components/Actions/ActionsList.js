import React, { useContext } from "react";
import { formatActionString } from "utils";
import { SIGNER_RESPONSES } from "constants/enums";
import { useModalContext } from "contexts";
import { Web3Context } from "contexts/Web3";
import ActionRequired from "./components/ActionRequired";
import { useErrorMessage } from "hooks";
import Svg from "library/Svg";

function ActionsList({
  actions = [],
  onApprove,
  onReject,
  onExecute,
  safeData,
}) {
  const ActionComponents = [];

  const { getActionView } = useContext(Web3Context);
  const { showErrorModal } = useErrorMessage();
  const { openModal, closeModal } = useModalContext();

  const onApproveAction = async (action) => {
    try {
      await onApprove(action);
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

  const openApproveOrRejectModal = async (action) => {
    const view = await getActionView(safeData.address, action.uuid);
    openModal(
      <ActionRequired
        safeData={safeData}
        actionView={view}
        confirmations={action.signerResponses}
        onApprove={() => onApproveAction(action)}
        onReject={() => onRejectAction(action)}
      />,
      { headerTitle: "Action Required" }
    );
  };

  if (!actions.length) {
    ActionComponents.push(
      <div className="flex-1 mx-0 p-3 has-text-centered">
        You do not have any pending actions.
      </div>
    );
  } else {
    ActionComponents.push(
      <div className="px-5 m-0 columns has-text-left has-text-grey is-align-items-center is-hidden-touch">
        <div className="column px-0 is-1">#</div>
        <div className="column px-0 is-4">Info</div>
        <div className="column is-3">Status</div>
        <div className="column px-0 is-2">Signatures</div>
        <div className="column px-0 is-2">Action</div>
      </div>
    );
    actions.forEach((action, idx) => {
      const totalSigned = Object.values(action.signerResponses).filter(
        (x) => x === SIGNER_RESPONSES.APPROVED
      ).length;
      const executionReady = totalSigned >= safeData.threshold;
      const background = executionReady
        ? "has-text-danger"
        : "has-text-warning";
      const actionPrompt = executionReady
        ? "Pending Execution"
        : "Pending Confirmation";
      const actionText = executionReady ? "Execute" : "Confirm";
      const actionSvg = executionReady ? "Quill" : "EmptyCheck";
      const actionFn = executionReady ? onExecute : openApproveOrRejectModal;
      ActionComponents.push(
        <div
          key={action.uuid}
          className="p-5 m-0 columns is-align-items-center is-multiline is-mobile"
        >
          <div className="column px-0 is-1 is-one-fifth-mobile">
            {String(idx + 1).padStart(2, "0")}{" "}
          </div>
          <div className="column px-0 is-4-desktop is-four-fifths-mobile">
            {formatActionString(action.intent)}
          </div>
          <div className="column is-3 is-hidden-touch">
            <Svg key={background} name="Status" className={background} />
            <label className="ml-1">{actionPrompt}</label>
          </div>
          <div className="column px-0 is-2 is-hidden-touch">
            {totalSigned} of {safeData.threshold} signatures
          </div>
          <button
            className="button is-tertiary column is-flex is-2-desktop is-full-mobile"
            onClick={() => actionFn(action)}
          >
            <label className="mr-1">{actionText}</label>
            <Svg name={actionSvg} />
          </button>
        </div>
      );
    });
  }

  return (
    <div className="mt-4 py-3 border-light rounded-sm table-border">
      {ActionComponents}
    </div>
  );
}

export default ActionsList;
