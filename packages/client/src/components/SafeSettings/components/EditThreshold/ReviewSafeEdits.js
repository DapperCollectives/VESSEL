import SignatureBar from "../SignatureBar";
const ReviewSafeEdits = ({
  newOwner,
  ownerToBeRemoved,
  newThreshold,
  allSafeOwners,
  onBack,
  onSubmitClick,
}) => {
  const owner = newOwner || ownerToBeRemoved;
  const renderRow = (label, value) => {
    return (
      <div className="columns m-0 py-1  border-light-top">
        <label className="column px-0 has-text-grey">{label}</label>
        <div className="column ml-2 px-0 has-text-black has-text-weight-bold">{value}</div>
      </div>
    );
  };
  const mainSectionHeaderText = () => {
    if (newOwner) {
      return "Add Owner"
    }
    else if (ownerToBeRemoved) {
      return "Remove Owner"
    }
    else {
      return "Signature Threshold"
    }
  }
  const renderMainSection = () => {
    if (!owner) {
      return (
        <>
          <h1 className="is-family-monospace has-text-black has-text-weight-bold">{`${newThreshold} of ${allSafeOwners.length} owners`}</h1>
        </>
      )
    }
    if (owner.name)
      return (
        <>
          <h1 className="is-family-monospace has-text-black has-text-weight-bold">{owner.name}</h1>
          <div className="has-text-black has-text-weight-bold">{owner.address}</div>
        </>
      );
    return (
      <h1 className="has-text-black has-text-weight-bold">{owner.address}</h1>
    );
  }

  return (
    <>
      <div className="p-4">
        <h2 className="is-size-4 has-text-black">Review Updates</h2>
      </div>
      <div className="border-light-top p-4 has-text-grey">
        <p className="has-text-grey">{mainSectionHeaderText()}</p>
        <div className="pb-4">
          {renderMainSection()}
        </div>
        {renderRow("Proposed On", new Date().toLocaleDateString("en-US"))}
        {/* only render signature threshold row if edit is AddOwner or RemoveOwner */}
        {newOwner || ownerToBeRemoved ? renderRow("Signature Threshold", `${newThreshold} of ${allSafeOwners.length} owner(s)`) : <></>}
        <div className="is-flex is-align-items-center pt-5 border-light-top">
          <button className="button flex-1 is-border mr-2" onClick={onBack}>
            Back
          </button>
          <button className="button flex-1 is-primary" onClick={onSubmitClick}>
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
