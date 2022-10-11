import { useModalContext } from 'contexts/Modal';
import { REVIEW_ACTION_TYPES } from 'constants/constants';
import { formatAddress } from 'utils';
import EditThreshold from '../EditThreshold';

const ReviewEditSafeOwners = ({
  actionType, // defined in REVIEW_ACTION_TYPES enum
  owner,
  newThreshold,
  safeOwners,
  onSubmit,
  treasury,
}) => {
  const { openModal } = useModalContext();

  const renderRow = (label, value) => (
    <div className="columns m-0 py-1  border-light-top">
      <label className="column px-0 has-text-grey">{label}</label>
      <div className="column ml-2 px-0 has-text-black has-text-weight-bold">
        {value}
      </div>
    </div>
  );

  const onBack = async () => {
    const newOwner =
      actionType === REVIEW_ACTION_TYPES.ADD_OWNER ? owner : null;
    const ownerToBeRemoved =
      actionType === REVIEW_ACTION_TYPES.REMOVE_OWNER ? owner : null;
    openModal(
      <EditThreshold
        treasury={treasury}
        newOwner={newOwner}
        ownerToBeRemoved={ownerToBeRemoved}
      />,
      { headerTitle: 'Set A New Threshold' }
    );
  };

  return (
    <>
      <div className="p-5 has-text-grey">
        <p className="has-text-grey">
          {actionType === REVIEW_ACTION_TYPES.ADD_OWNER
            ? 'New Owner'
            : 'Remove Owner'}
        </p>
        {owner.name ? (
          // If name is set (
          <div className="pb-4">
            <h1 className="is-family-monospace has-text-black has-text-weight-bold">
              {owner.name}
            </h1>
            <div className="has-text-black has-text-weight-bold">
              {formatAddress(owner.address)}
            </div>
          </div>
        ) : (
          // If address Only
          <h1 className="has-text-black has-text-weight-bold">
            {formatAddress(owner.address)}
          </h1>
        )}
        {renderRow('Proposed On', new Date().toLocaleDateString('en-US'))}
        {renderRow(
          'Signature Threshold',
          `${newThreshold} of ${safeOwners.length} owner(s)`
        )}
        <p className="pt-4 border-light-top">
          To complete this action, you will have to confirm it with your
          connected wallet on the next step.
        </p>
      </div>
      <div className="is-flex is-align-items-center p-5 border-light-top">
        <button className="button flex-1 is-border mr-2" onClick={onBack}>
          Back
        </button>
        <button className="button flex-1 is-primary" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </>
  );
};

export default ReviewEditSafeOwners;
