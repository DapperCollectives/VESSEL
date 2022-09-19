import { ACTION_TYPES } from "constants/enums";
import NFTView from "./NFTView";
import TokenView from "./TokenView";
import OwnerView from "./OwnerView";
import ThresholdView from "./ThresholdView";
import Confirmations from "./Confirmations";

const ActionRequired = ({
  safeData,
  actionView,
  confirmations,
  onReject,
  onApprove,
}) => {
  const actionType = actionView.type;

  const getActionView = () => {
    switch (actionType) {
      case ACTION_TYPES.TRANSFER_TOKEN:
        return <TokenView actionView={actionView} safeData={safeData} />;
      case ACTION_TYPES.TRANSFER_NFT:
        return <NFTView actionView={actionView} safeData={safeData} />;
      case ACTION_TYPES.ADD_OWNER:
        return (
          <OwnerView actionView={actionView} safeData={safeData} isAdd={true} />
        );
      case ACTION_TYPES.REMOVE_OWNER:
        return (
          <OwnerView
            actionView={actionView}
            safeData={safeData}
            isAdd={false}
          />
        );
      case ACTION_TYPES.UPDATE_THRESHOLD:
        return <ThresholdView actionView={actionView} safeData={safeData} />;
      default:
        return <></>;
    }
  };

  return (
    <div className="p-5 has-text-grey">
      {getActionView()}
      <Confirmations confirmations={confirmations} safeData={safeData} />
      <div className="is-flex is-align-items-center mt-5">
        <button className="button flex-1 is-border mr-2" onClick={onReject}>
          Reject
        </button>
        <button className={"button flex-1 is-primary"} onClick={onApprove}>
          Approve
        </button>
      </div>
    </div>
  );
};
export default ActionRequired;
