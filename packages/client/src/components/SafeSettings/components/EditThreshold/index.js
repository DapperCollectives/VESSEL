import { useState } from "react";
import ReviewUpdateThreshold from "./ReviewUpdateThreshold.js";
import EditThresholdForm from "./EditThresholdForm";
import ReviewEditSafeOwners from "../Owners/ReviewEditSafeOwners";
import useTreasury from "hooks/useTreasury"
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts/Modal.js";
import { formatAddress } from "utils.js";

const EditThreshold = ({ treasury, newOwner, ownerToBeRemoved }) => {
  const { proposeAddSigner, proposeRemoveSigner, setTreasury } = useTreasury(treasury.address);
  const { closeModal } = useModalContext()
  const history = useHistory()
  const [currStep, setCurrStep] = useState(0);
  const { address, safeOwners, threshold } = treasury;
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

  const onConfirmAddOwner = async () => {
    await proposeAddSigner(formatAddress(newOwner.address), newThreshold);
    setTreasury(address, {
      safeOwners: [...safeOwners, { ...newOwner, verified: false }],
    })
    closeModal();
    history.push(`/safe/${address}`);
  }

  const onConfirmRemoveOwner = async () => {
    console.log("on confirm remove owner", ownerToBeRemoved.address)
    await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address), newThreshold);
    setTreasury(address, {
      safeOwners: safeOwners.filter((o) => o.address !== ownerToBeRemoved.address),
    });
    closeModal();
    history.push(`/safe/${address}`);
  }

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
    return <ReviewEditSafeOwners 
      actionText="New Owner"
      owner={newOwner}
      newThreshold={newThreshold}
      safeOwners={allSafeOwners}
      onBack={() => setCurrStep(0)}
      onSubmit={onConfirmAddOwner}
    />
  }
  else if (ownerToBeRemoved) {
    return <ReviewEditSafeOwners 
      actionText="Remove Owner"
      owner={ownerToBeRemoved}
      newThreshold={newThreshold}
      safeOwners={allSafeOwners}
      onBack={() => setCurrStep(0)}
      onSubmit={onConfirmRemoveOwner}
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
