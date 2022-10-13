import NFTView from '../components/Actions/components/NFTView';
import SignerThresholdView from '../components/Actions/components/SignerThresholdView';
import ThresholdView from '../components/Actions/components/ThresholdView';
import TokenView from '../components/Actions/components/TokenView';
import Signatures from 'components/Signatures';
import { ACTION_TYPES } from 'constants/enums';

const ApprovalRequired = ({
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
            isAdd
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
        <Signatures
          confirmations={confirmations}
          safeOwners={safeData.safeOwners}
        />
      </div>
      <div className="border-light-bottom">
        <div className="px-5 pb-5">
          To complete this action, you will have to confirm it with your
          connected wallet on the next step.
        </div>
      </div>
      <div className="p-5 is-flex">
        <button
          type="button"
          className="button flex-1 is-border mr-2"
          onClick={onReject}
        >
          Reject
        </button>
        <button
          type="button"
          className="button flex-1 is-primary"
          onClick={onApprove}
        >
          Approve
        </button>
      </div>
    </div>
  );
};
export default ApprovalRequired;
