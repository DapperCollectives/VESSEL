import { useState, useMemo } from "react";
import { getProgressPercentageForSignersAmount } from "utils";
import { Person, Minus, Plus } from "components/Svg";
import ProgressBar from "components/ProgressBar";

const EditSignatureThreshold = ({
  safeOwners,
  threshold,
  newOwner,
  onCancel,
  onReview,
}) => {
  const [currSignersAmount, setCurrSignersAmount] = useState(threshold);
  const allSafeOwners = useMemo(() => {
    const owners = [...safeOwners];

    if (newOwner) {
      owners.push(newOwner);
    }

    return owners;
  }, [safeOwners, newOwner]);

  const onMinusSignerClick = () => {
    setCurrSignersAmount((curr) => Math.max(curr - 1, 1));
  };

  const onPlusSignerClick = () => {
    setCurrSignersAmount((curr) => Math.min(curr + 1, allSafeOwners.length));
  };

  const onReviewClick = () => {
    onReview(newOwner, currSignersAmount);
  };

  const canContinueToReview = !!newOwner || currSignersAmount !== threshold;
  const signerClasses = [
    "is-flex",
    "is-justify-content-center",
    "is-align-items-center",
  ];
  const minusSignerClasses = [
    ...signerClasses,
    "border-light-right",
    currSignersAmount > 1 ? "pointer has-text-black" : "is-disabled",
  ];
  const plusSignerClasses = [
    ...signerClasses,
    currSignersAmount < allSafeOwners.length
      ? "pointer has-text-black"
      : "is-disabled",
  ];
  const reviewButtonClasses = [
    "button flex-1 p-4",
    canContinueToReview ? "is-link" : "is-light is-disabled",
  ];
  const progress = getProgressPercentageForSignersAmount(currSignersAmount);

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Set a new threshold</h2>
        <p className="has-text-grey">
          Signatures needed to approve a new transaction
        </p>
      </div>
      <div className="border-light-top py-6 px-5 has-text-grey">
        <p className="mb-2">Signatures required to confirm a transaction</p>
        <div className="is-flex border-light rounded-sm">
          <div className="px-5 border-light-right has-text-black">
            <Person />
          </div>
          <div className="flex-1 is-flex is-align-items-center px-5 border-light-right has-text-black">
            {currSignersAmount} of {Math.max(allSafeOwners.length, 1)} owner(s)
          </div>
          <div
            className={minusSignerClasses.join(" ")}
            style={{ width: 48 }}
            onClick={onMinusSignerClick}
          >
            <Minus />
          </div>
          <div
            className={plusSignerClasses.join(" ")}
            style={{ width: 48 }}
            onClick={onPlusSignerClick}
          >
            <Plus />
          </div>
        </div>
        <div className="flex-1 is-flex is-flex-direction-column mt-5">
          <div className="is-flex is-justify-content-space-between mb-2">
            <label className="has-text-black">Security Strength</label>
            <label className="has-text-black">{progress}%</label>
          </div>
          <div className="is-flex flex-1">
            <div
              className="is-flex column is-full border-light rounded-sm"
              style={{ minHeight: 48 }}
            >
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={reviewButtonClasses.join(" ")}
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
export default EditSignatureThreshold;
