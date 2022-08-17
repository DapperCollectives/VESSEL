import { useHistory } from "react-router-dom";
import { formatAddress } from "utils";
import { useTreasury } from "hooks";
import { useState } from "react";
import { useModalContext } from "contexts";
import ReviewSafeEdits from "./ReviewSafeEdits";
import EditThresholdForm from "./EditThresholdForm";
const EditThreshold = ({ treasury, newOwner }) => {
  const history = useHistory();
  const { closeModal } = useModalContext();
  const [currStep, setCurrStep] = useState(0);
  const { safeOwners, threshold, address } = treasury;
  const { proposeAddSigner, updateThreshold, setTreasury } =
    useTreasury(address);
  const [newThreshold, setNewThreshold] = useState(Number(threshold));
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  const allSafeOwners = newOwner
    ? [...verifiedSafeOwners, newOwner]
    : verifiedSafeOwners;
  const canContinueToReview = !!newOwner || newThreshold !== threshold;
  const onChangeThreshold = (isIncrease) => {
    setNewThreshold((prevState) =>
      isIncrease ? prevState + 1 : prevState - 1
    );
  };

  const onSubmitClick = async () => {
    const thresholdToPersist = newThreshold ?? threshold;

    if (newOwner) {
      await proposeAddSigner(formatAddress(newOwner.address));
    }

    if (thresholdToPersist !== threshold) {
      await updateThreshold(thresholdToPersist);
    }
    setTreasury(address, {
      threshold: thresholdToPersist,
      safeOwners: [...safeOwners, { ...newOwner, verified: false }],
    });

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
