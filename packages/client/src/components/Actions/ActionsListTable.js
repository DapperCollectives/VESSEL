import { useContext } from "react";
import { useErrorMessage } from "hooks";
import { formatActionString } from "utils";
import { useModalContext } from "contexts";
import { Web3Context } from "contexts/Web3";
import { SIGNER_RESPONSES } from "constants/enums";
import Svg from "library/Svg";
import ApprovalRequired from "./components/ApprovalRequired";

const Row = ({ threshold, action, displayIndex, onApprove, onSign }) => {
  const { intent } = action;
  const totalSigned = Object.values(action.signerResponses).filter(
    (x) => x === SIGNER_RESPONSES.APPROVED
  ).length;
  const executionReady = totalSigned >= threshold;
  const background = executionReady ? "has-text-danger" : "has-text-warning";
  const actionPrompt = executionReady
    ? "Pending Signature"
    : "Pending Approval";
  const actionSvg = executionReady ? "Quill" : "EmptyCheck";
  const actionText = executionReady ? "Sign" : "Approve";
  const actionFn = executionReady ? onSign : onApprove;

  return (
    <>
      <tr className="py-4 is-flex is-align-items-center">
        <td className="p-3 flex-1">{String(displayIndex).padStart(2, "0")}</td>
        <td className="p-3 flex-7">{formatActionString(intent)}</td>
        <td className="p-3 flex-4 is-hidden-touch">
          <Svg key={background} name="Status" className={background} />
          <span className="ml-2">{actionPrompt}</span>
        </td>
        <td className="p-3 flex-3 is-hidden-touch">
          {totalSigned} of {threshold} signatures
        </td>
        <td className="p-3 is-flex flex-4 is-hidden-touch">
          <button
            type="button"
            className="button flex-4 is-flex is-tertiary with-icon"
            onClick={() => actionFn(action)}
          >
            {actionText}
            <Svg name={actionSvg} />
          </button>
        </td>
      </tr>
      <tr className="is-hidden-desktop">
        <td className="p-3 is-flex">
          <button
            type="button"
            className="button flex-1 is-tertiary with-icon"
            onClick={() => actionFn(action)}
          >
            {actionText}
            <Svg name={actionSvg} />
          </button>
        </td>
      </tr>
    </>
  );
};

const ActionsListTable = ({
  safeData,
  actions,
  onApprove,
  onReject,
  onExecute,
}) => {
  const { address, threshold } = safeData;
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

  const openApprovalRequiredModal = async (action) => {
    const { uuid, signerResponses } = action;
    const view = await getActionView(address, uuid);
    openModal(
      <ApprovalRequired
        safeData={safeData}
        actionView={view}
        confirmations={signerResponses}
        onApprove={() => onApproveAction(action)}
        onReject={() => onRejectAction(action)}
      />,
      { headerTitle: "Approval Required" }
    );
  };

  return (
    <table className="border-light rounded-sm">
      <thead>
        <tr className="is-flex has-text-grey border-light-bottom is-hidden-touch">
          <th className="p-3 flex-1">#</th>
          <th className="p-3 flex-7">Info</th>
          <th className="p-3 flex-4">Status</th>
          <th className="p-3 flex-3">Signatures</th>
          <th className="p-3 flex-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {actions.map((action, index) => (
          <Row
            key={action.uuid}
            action={action}
            threshold={threshold}
            displayIndex={index + 1}
            onApprove={openApprovalRequiredModal}
            onSign={onExecute}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ActionsListTable;
