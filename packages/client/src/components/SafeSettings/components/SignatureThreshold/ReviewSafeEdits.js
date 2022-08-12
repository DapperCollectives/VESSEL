import { useMemo } from "react";
import SignatureBar from "./SignatureBar";
const ReviewSafeEdits = ({
  safeOwners,
  threshold,
  newOwner,
  newThreshold,
  onBack,
  onSubmit,
}) => {
  const thresholdForDisplay = useMemo(
    () => newThreshold ?? threshold,
    [newThreshold, threshold]
  );
  const safeOwnersForDisplay = useMemo(() => {
    const owners = [...safeOwners];

    if (newOwner) {
      owners.push(newOwner);
    }

    return owners;
  }, [safeOwners, newOwner]);

  const onSubmitClick = () => {
    onSubmit(newOwner, newThreshold);
  };

  const renderRow = (label, value) => {
    return (
      <div className="is-flex is-align-items-center is-justify-content-space-between py-5 border-light-top">
        <label className="has-text-grey">{label}</label>
        <div className="has-text-black">{value}</div>
      </div>
    );
  };

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Review updates</h2>
        <p className="has-text-grey">
          Confirm the details below before submitting
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="is-flex pt-1 pb-5">
          <div className="is-flex flex-1 is-flex-direction-column border-light-right">
            <label>Number of owners</label>
            <div className="has-text-black is-size-5">
              {safeOwnersForDisplay.length}
            </div>
          </div>
          <div className="is-flex flex-1 is-flex-direction-column pl-5">
            <label>Signature threshold</label>
            <div className="is-flex is-align-items-center">
              <span
                className="is-size-5 has-text-black"
                style={{ whiteSpace: "nowrap" }}
              >
                {thresholdForDisplay} of {safeOwnersForDisplay.length}
              </span>
              <div className="is-flex ml-1" style={{ height: 16 }}>
                <SignatureBar
                  threshold={thresholdForDisplay}
                  safeOwners={safeOwnersForDisplay}
                />
              </div>
            </div>
          </div>
        </div>
        {newOwner && renderRow("New owner", newOwner.name)}
        {newOwner && renderRow("Address", newOwner.address)}
        {renderRow("Transaction date", new Date().toLocaleDateString("en-US"))}
        <div className="is-flex is-align-items-center mt-5">
          <button className="button flex-1 p-4 mr-2" onClick={onBack}>
            Back
          </button>
          <button className="button flex-1 p-4 is-link" onClick={onSubmitClick}>
            Submit
          </button>
        </div>
        <p className="mt-4">
          You're about to create a transaction and will have to confirm it with
          your currently connected wallet.
        </p>
      </div>
    </>
  );
};

export default ReviewSafeEdits;
