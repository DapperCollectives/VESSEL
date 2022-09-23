import { formatAddress } from "utils";

const ReviewEditSafeOwners = ({
  owner,
  newThreshold,
  safeOwners,
  onBack,
  onSubmit
}) => {
  const renderRow = (label, value) => {
    return (
      <div className="columns m-0 py-1  border-light-top">
        <label className="column px-0 has-text-grey">{label}</label>
        <div className="column ml-2 px-0 has-text-black has-text-weight-bold">{value}</div>
      </div>
    );
  };

  return (
    <>
      <div className="p-4">
        <h2 className="is-size-4 has-text-black">Review Updates</h2>
      </div>
      <div className="border-light-top p-4 has-text-grey">
        <p className="has-text-grey">New Owner</p>
        { owner.name ?
          // If name is set
          <div className="pb-4">
            <h1 className="is-family-monospace has-text-black has-text-weight-bold">{owner.name}</h1>
            <div className="has-text-black has-text-weight-bold">{formatAddress(owner.address)}</div>
          </div> :
          // If address Only
          <h1 className="has-text-black has-text-weight-bold">{formatAddress(owner.address)}</h1>
        }
        {renderRow("Proposed On", new Date().toLocaleDateString("en-US"))}
        {renderRow("Signature Threshold", `${newThreshold} of ${safeOwners.length} owner(s)`)}
        <p className="py-4 border-light-top">
          To complete this action, you will have to confirm it with your connected wallet on the next step.
        </p>
        <div className="is-flex is-align-items-center pt-5 border-light-top">
          <button className="button flex-1 is-border mr-2" onClick={onBack}>
            Back
          </button>
          <button className="button flex-1 is-primary" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ReviewEditSafeOwners;
