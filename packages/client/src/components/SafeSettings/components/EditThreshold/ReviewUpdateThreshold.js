import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { Web3Context } from "contexts/Web3";

const ReviewUpdateThreshold = ({
  newThreshold,
  allSafeOwners,
  onBack,
  treasury
}) => {
  const history = useHistory();
  const { updateThreshold, setTreasury } =
  useContext(Web3Context);
  const { closeModal } = useModalContext();
  const { address } = treasury;
  const renderRow = (label, value) => {
    return (
      <div className="columns m-0 py-1 border-light-top">
        <label className="column px-0 has-text-grey">{label}</label>
        <div className="column ml-2 px-0 has-text-black has-text-weight-bold">{value}</div>
      </div>
    );
  };

   const onSubmitClick = async () => {
    await updateThreshold(newThreshold);
    setTreasury(address, {
      threshold: newThreshold
    })
    closeModal();
    history.push(`/safe/${address}`);
   }

  return (
    <>
      <div className="p-5 has-text-grey">
        <p className="has-text-grey">Update Threshold</p>
        <div className="pb-4">
          <h1 className="is-family-monospace has-text-black has-text-weight-bold">{`${newThreshold} of ${allSafeOwners.length} owners`}</h1>
        </div>
        {renderRow("Proposed On", new Date().toLocaleDateString("en-US"))}
        <p className="pt-4 border-light-top">
        To complete this action, you will have to confirm it with your connected wallet on the next step.
        </p>
      </div>
      <div className="is-flex is-align-items-center p-5 border-light-top">
          <button className="button flex-1 is-border mr-2" onClick={onBack}>
            Back
          </button>
          <button className="button flex-1 is-primary" onClick={onSubmitClick}>
            Submit
          </button>
        </div>
    </>
  );
};

export default ReviewUpdateThreshold;
