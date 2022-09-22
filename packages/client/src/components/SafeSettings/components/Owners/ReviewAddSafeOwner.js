import { useContext } from "react";
import { useModalContext } from "contexts";
import { useHistory } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import { formatAddress } from "utils";
import OwnerCard from "./OwnerCard";

const ReviewAddSafeOwner = ({
  owner,
  newThreshold,
  safeOwners,
  onBack,
  treasury
}) => {
  const history = useHistory();
  const { closeModal } = useModalContext();
  const { address } = treasury
  const { proposeAddSigner, setTreasury } =
  useContext(Web3Context);

  const renderRow = (label, value) => {
    return (
      <div className="columns m-0 py-1  border-light-top">
        <label className="column px-0 has-text-grey">{label}</label>
        <div className="column ml-2 px-0 has-text-black has-text-weight-bold">{value}</div>
      </div>
    );
  };

  const onSubmitClick = async () => {
    await proposeAddSigner(formatAddress(owner.address), newThreshold);
    setTreasury(address, {
      safeOwners: [...safeOwners, { ...owner, verified: false }],
    });
    closeModal();
    history.push(`/safe/${address}`);
  }

  return (
    <>
      <div className="p-4">
        <h2 className="is-size-4 has-text-black">Review Updates</h2>
      </div>
      <div className="border-light-top p-4 has-text-grey">
        <p className="has-text-grey">Add Owner</p>
        <OwnerCard owner={owner}></OwnerCard>
        {renderRow("Proposed On", new Date().toLocaleDateString("en-US"))}
        {renderRow("Signature Threshold", `${newThreshold} of ${safeOwners.length} owner(s)`)}
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

export default ReviewAddSafeOwner;
