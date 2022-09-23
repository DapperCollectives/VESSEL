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
  const { openModal, closeModal } = useModalContext()
  const history = useHistory()
  // const [currStep, setCurrStep] = useState(0);
  const { address, safeOwners, threshold } = treasury;
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  let allSafeOwners;
  if (newOwner) {
    allSafeOwners = [...verifiedSafeOwners, newOwner];
  } else if (ownerToBeRemoved) {
    allSafeOwners = verifiedSafeOwners.filter(o => o.address !== ownerToBeRemoved.address);
  } else {
    allSafeOwners = verifiedSafeOwners
  }
  const [newThreshold, setNewThreshold] = useState(Math.min(Number(threshold), allSafeOwners.length));
  console.log("New", newOwner)
  console.log("Remove", ownerToBeRemoved)
  console.log("All Safe Owners", allSafeOwners)
  
  const canContinueToReview = !!newOwner || newThreshold !== threshold;
  const onChangeThreshold = (isIncrease) => {
    setNewThreshold((prevState) =>
      isIncrease ? prevState + 1 : prevState - 1
    );
  };

  const onConfirmAddOwner = async () => {
    console.log("confirm add owner:", newOwner)
    await proposeAddSigner(formatAddress(newOwner.address), newThreshold);
    setTreasury(address, {
      safeOwners: [...safeOwners, { ...newOwner, verified: false }],
    })
    closeModal();
    history.push(`/safe/${address}`);
  }

  const onConfirmRemoveOwner = async () => {
    await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address), newThreshold);
    console.log("treasury address: ", address)
    setTreasury(address, treasury);
    history.push(`/safe/${address}`);
    closeModal();
  }

  const onReviewClick = async () => {
    if (newOwner) {
      openModal(
        <ReviewEditSafeOwners 
          actionType="Add"
          owner={newOwner}
          newThreshold={newThreshold}
          safeOwners={allSafeOwners}
          onSubmit={onConfirmAddOwner}
          treasury={treasury}
        />,
        { headerTitle: "Review Updates" }
      )
    }
    else if (ownerToBeRemoved) {
      openModal(
        <ReviewEditSafeOwners 
          actionType="Remove"
          owner={ownerToBeRemoved}
          newThreshold={newThreshold}
          safeOwners={allSafeOwners}
          onSubmit={onConfirmRemoveOwner}
          treasury={treasury}
        />,
        { headerTitle: "Review Updates" }
      )
    }
    else {
      openModal(
        <ReviewUpdateThreshold
          newOwner={newOwner}
          ownerToBeRemoved={ownerToBeRemoved}
          newThreshold={newThreshold}
          allSafeOwners={allSafeOwners}
          // onBack={() => setCurrStep(0)}
          treasury={treasury}
        />,
        { headerTitle: "Review Updates"}
      )
    }
  }

  return (
    <EditThresholdForm
      newThreshold={newThreshold}
      safeOwners={allSafeOwners}
      canContinueToReview={canContinueToReview}
      onReviewClick={onReviewClick}
      onChangeThreshold={onChangeThreshold}
    />
  );
};

export default EditThreshold;
