import { useState } from "react";
import ReviewUpdateThreshold from "./ReviewUpdateThreshold.js";
import EditThresholdForm from "./EditThresholdForm";
import ReviewAddSafeOwner from "../Owners/ReviewAddSafeOwner";
import ReviewRemoveSafeOwner from "../Owners/ReviewRemoveSafeOwner";

const EditThreshold = ({ treasury, newOwner, ownerToBeRemoved }) => {
  const [currStep, setCurrStep] = useState(0);
  const { safeOwners, threshold } = treasury;
  const [newThreshold, setNewThreshold] = useState(Number(threshold));
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  let allSafeOwners;
  if (newOwner) {
    allSafeOwners = [...verifiedSafeOwners, newOwner];
  } else if (ownerToBeRemoved) {
    allSafeOwners = verifiedSafeOwners.filter(o => o.address !== ownerToBeRemoved.address);
  } else {
    allSafeOwners = verifiedSafeOwners
  }
  
  const canContinueToReview = !!newOwner || newThreshold !== threshold;
  const onChangeThreshold = (isIncrease) => {
    setNewThreshold((prevState) =>
      isIncrease ? prevState + 1 : prevState - 1
    );
  };

  if (currStep === 0) {
    return (
      <EditThresholdForm
        newThreshold={newThreshold}
        safeOwners={allSafeOwners}
        canContinueToReview={canContinueToReview}
        onReviewClick={() => setCurrStep(1)}
        onChangeThreshold={onChangeThreshold}
      />
    );
  }
  if (newOwner) {
    return <ReviewAddSafeOwner 
      owner={newOwner}
      newThreshold={newThreshold}
      safeOwners={allSafeOwners}
      onBack={() => setCurrStep(0)}
      treasury={treasury}
    />
  }
  else if (ownerToBeRemoved) {
    return <ReviewRemoveSafeOwner 
      owner={ownerToBeRemoved}
      newThreshold={newThreshold}
      safeOwners={allSafeOwners}
      onBack={() => setCurrStep(0)}
      treasury={treasury}
    />
  }
  else {
    return <ReviewUpdateThreshold
      newOwner={newOwner}
      ownerToBeRemoved={ownerToBeRemoved}
      newThreshold={newThreshold}
      allSafeOwners={allSafeOwners}
      onBack={() => setCurrStep(0)}
      treasury={treasury}
    />
  }
};

export default EditThreshold;
