import ProposedDateView from 'components/Actions/components/ProposedDateView';
import SentFromToView from 'components/Actions/components/SentFromToView';
import Signatures from 'components/Signatures';
import { useContacts } from 'hooks';
import { ACTION_TYPES } from 'constants/enums';
import BannerInfo from './Transaction/BannerInfo';

const ApprovalRequired = ({
  safeData,
  actionView,
  confirmations,
  onReject,
  onApprove,
}) => {
  const { type: actionType, newThreshold } = actionView;
  const { contacts } = useContacts();

  let title;
  switch (actionType) {
    case ACTION_TYPES.TRANSFER_TOKEN:
      title = 'Amount';
      break;
    case ACTION_TYPES.TRANSFER_NFT:
      title = '';
      break;
    case ACTION_TYPES.ADD_SIGNER_UPDATE_THRESHOLD:
      title = 'New Owner';
      break;
    case ACTION_TYPES.REMOVE_SIGNER_UPDATE_THRESHOLD:
      title = 'Remove Owner';
      break;
    case ACTION_TYPES.UPDATE_THRESHOLD:
      title = 'Signature Threshold';
      break;
    default:
      break;
  }

  return (
    <div className="has-text-grey">
      <div className="p-5">
        <p className="is-size-6">{title}</p>
        <BannerInfo
          actionData={actionView}
          contacts={contacts}
          signers={safeData.safeOwners}
          className="pl-4 pb-5 has-text-black"
        />
        <ProposedDateView timestamp={actionView.timestamp} />
        {actionType === ACTION_TYPES.TRANSFER_NFT ||
          (actionType === ACTION_TYPES.TRANSFER_TOKEN && (
            <SentFromToView
              safeData={safeData}
              recipient={actionView.recipient}
            />
          ))}
        {actionType === ACTION_TYPES.ADD_SIGNER_UPDATE_THRESHOLD ||
          (actionType === ACTION_TYPES.REMOVE_SIGNER_UPDATE_THRESHOLD && (
            <div className="m-1 columns is-size-6 border-light-bottom">
              <span className="column pl-0 has-text-grey">
                Signature Threshold
              </span>
              <div className="column pl-0">
                <span className="has-text-weight-bold has-text-black">
                  {newThreshold} of {safeData.safeOwners.length} owner(s)
                </span>
              </div>
            </div>
          ))}
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
