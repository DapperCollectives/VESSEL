import { useState, useContext } from "react";
import ReviewUpdateThreshold from "./ReviewUpdateThreshold.js";
import EditThresholdForm from "./EditThresholdForm";
import ReviewEditSafeOwners from "../Owners/ReviewEditSafeOwners";
import { Web3Context } from "contexts/Web3";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts/Modal";
import { formatAddress } from "utils";

const EditThreshold = ({ treasury, newOwner, ownerToBeRemoved }) => {
  const { openModal, closeModal } = useModalContext()
  const history = useHistory();
  const web3 = useContext(Web3Context);
  const { setTreasury, proposeAddSigner, proposeRemoveSigner } = web3;
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
    await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address), newThreshold);
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
