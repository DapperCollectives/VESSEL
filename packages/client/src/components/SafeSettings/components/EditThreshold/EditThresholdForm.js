import { useModalContext } from 'contexts';
import SecurityStrengthLabel from 'library/components/SecurityStrengthLabel';
import { getProgressPercentageForSignersAmount } from 'utils';
import Svg from 'library/Svg';

const EditThresholdForm = ({
  newThreshold,
  safeOwners,
  canContinueToReview,
  onReviewClick,
  onChangeThreshold,
}) => {
  const { closeModal } = useModalContext();
  const signerClasses = [
    'is-flex',
    'is-justify-content-center',
    'is-align-items-center',
  ];
  const minusSignerClasses = [
    ...signerClasses,
    'border-light-right',
    newThreshold > 1 ? 'pointer has-text-black' : 'is-disabled',
  ];
  const plusSignerClasses = [
    ...signerClasses,
    newThreshold < safeOwners.length ? 'pointer has-text-black' : 'is-disabled',
  ];
  const reviewButtonClasses = [
    'button is-primary flex-1 has-text-weight-bold',
    canContinueToReview ? '' : 'disabled',
  ];
  const progress = getProgressPercentageForSignersAmount(newThreshold);

  return (
    <>
      <div className="border-light-bottom p-5 has-text-grey">
        <p className="mb-2">
          Number of signatures required to confirm a transaction.
        </p>
        <div className="is-flex border-light rounded-sm">
          <div className="px-5 border-light-right has-text-black">
            <Svg name="Person" />
          </div>
          <div className="flex-1 is-flex is-align-items-center px-5 border-light-right has-text-black">
            {newThreshold} of{Math.max(safeOwners.length, 1)} owner(s)
          </div>
          <div
            className={minusSignerClasses.join(' ')}
            style={{ width: 48 }}
            onClick={() => onChangeThreshold(false)}
          >
            <Svg name="Minus" />
          </div>
          <div
            className={plusSignerClasses.join(' ')}
            style={{ width: 48 }}
            onClick={() => onChangeThreshold(true)}
          >
            <Svg name="Plus" />
          </div>
        </div>
        <div className="flex-1 is-flex is-flex-direction-column mt-5">
          <div className="is-flex is-align-items-center mb-2">
            <label className="has-text-grey">Security Strength:</label>
            <SecurityStrengthLabel progress={progress} />
          </div>
        </div>
      </div>
      <div>
        <div className="is-flex is-align-items-center p-5">
          <button
            className="button flex-1 is-border mr-2 has-text-weight-bold"
            onClick={() => closeModal()}
          >
            Cancel
          </button>
          <button
            className={reviewButtonClasses.join(' ')}
            disabled={!canContinueToReview}
            onClick={onReviewClick}
          >
            Review
          </button>
        </div>
      </div>
    </>
  );
};
export default EditThresholdForm;
