import { ACTION_TYPES } from "constants/enums";
import NFTView from "./NFTView";
import TokenView from "./TokenView";
import SignerThresholdView from "./SignerThresholdView";
import ThresholdView from "./ThresholdView";
import Confirmations from "./Confirmations";

const ActionRequired = ({
  safeData,
  actionView,
  confirmations,
  onReject,
  onApprove,
}) => {
  const { type: actionType } = actionView;

  const getActionView = () => {
    switch (actionType) {
      case ACTION_TYPES.TRANSFER_TOKEN:
        return <TokenView actionView={actionView} safeData={safeData} />;
      case ACTION_TYPES.TRANSFER_NFT:
        return <NFTView actionView={actionView} safeData={safeData} />;
      case ACTION_TYPES.ADD_SIGNER_UPDATE_THRESHOLD:
        return (
          <SignerThresholdView
            actionView={actionView}
            safeData={safeData}
            isAdd={true}
          />
        );
      case ACTION_TYPES.REMOVE_SIGNER_UPDATE_THRESHOLD:
        return (
          <SignerThresholdView
            actionView={actionView}
            safeData={safeData}
            isAdd={false}
          />
        );
      case ACTION_TYPES.UPDATE_THRESHOLD:
        return <ThresholdView actionView={actionView} safeData={safeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="has-text-grey">
      <div className="p-5">
        {getActionView()}
        <Confirmations confirmations={confirmations} safeData={safeData} />
      </div>
      <div className="border-light-bottom">
        <div className="px-5 pb-5">
          To complete this action, you will have to confirm it with your
          connected wallet on the next step.
        </div>
      </div>
      <div className="p-5 is-flex">
        <button className="button flex-1 is-border mr-2" onClick={onReject}>
          Reject
        </button>
        <button className="button flex-1 is-primary" onClick={onApprove}>
          Approve
        </button>
      </div>
    </div>
  );
};
export default ActionRequired;
