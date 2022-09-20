import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { formatAddress } from "utils";
import { useState } from "react";
import { useModalContext } from "contexts";
import { Web3Context } from "contexts/Web3";
import ReviewSafeEdits from "./ReviewSafeEdits";
import EditThresholdForm from "./EditThresholdForm";
const EditThreshold = ({ treasury, newOwner, ownerToBeRemoved }) => {
  const history = useHistory();
  const { closeModal } = useModalContext();
  const [currStep, setCurrStep] = useState(0);
  const { safeOwners, threshold, address } = treasury;
  const { proposeAddSigner, proposeRemoveSigner, setTreasury } =
    useContext(Web3Context);
  const [newThreshold, setNewThreshold] = useState(Number(threshold));
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  const allSafeOwners = newOwner
    ? [...verifiedSafeOwners, newOwner]
    : verifiedSafeOwners.filter(o => o.address !== ownerToBeRemoved.address);
  const canContinueToReview = !!newOwner || newThreshold !== threshold;
  const onChangeThreshold = (isIncrease) => {
    setNewThreshold((prevState) =>
      isIncrease ? prevState + 1 : prevState - 1
    );
  };

  const onSubmitClick = async () => {
    if (newOwner) {
      await proposeAddSigner(formatAddress(newOwner.address), newThreshold);
      setTreasury(address, {
        safeOwners: [...safeOwners, { ...newOwner, verified: false }],
      });
    }
    else if (ownerToBeRemoved) {
      await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address), newThreshold);
    }

    closeModal();
    history.push(`/safe/${address}`);
  };

  if (currStep === 1)
    return (
      <ReviewSafeEdits
        newOwner={newOwner}
        newThreshold={newThreshold}
        allSafeOwners={allSafeOwners}
        onBack={() => setCurrStep(0)}
        onSubmitClick={() => onSubmitClick()}
      />
    );
  return (
    <EditThresholdForm
      newThreshold={newThreshold}
      allSafeOwners={allSafeOwners}
      canContinueToReview={canContinueToReview}
      onReviewClick={() => setCurrStep(1)}
      onChangeThreshold={onChangeThreshold}
      closeModal={closeModal}
    />
  );
};
export default EditThreshold;
