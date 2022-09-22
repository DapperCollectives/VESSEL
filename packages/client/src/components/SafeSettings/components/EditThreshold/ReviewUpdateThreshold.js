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
  console.log("treasury :", treasury)

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
      <div className="p-4">
        <h2 className="is-size-4 has-text-black">Review Updates</h2>
      </div>
      <div className="border-light-top p-4 has-text-grey">
        <p className="has-text-grey">Update Threshold</p>
        <div className="pb-4">
          <h1 className="is-family-monospace has-text-black has-text-weight-bold">{`${newThreshold} of ${allSafeOwners.length} owners`}</h1>
        </div>
        {renderRow("Proposed On", new Date().toLocaleDateString("en-US"))}
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

export default ReviewUpdateThreshold;
