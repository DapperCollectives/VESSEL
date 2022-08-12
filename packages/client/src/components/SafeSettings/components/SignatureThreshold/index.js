import React from "react";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { useTreasury } from "hooks";
import SignatureBar from "./SignatureBar";
import EditSignatureThreshold from "./EditSignatureThreshold";
import ReviewSafeEdits from "./ReviewSafeEdits";
import { formatAddress } from "utils";

const SignatureThreshold = ({ treasury }) => {
  const modalContext = useModalContext();
  const history = useHistory();
  const { threshold, safeOwners, address } = treasury;
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  const { proposeAddSigner, updateThreshold, setTreasury } =
    useTreasury(address);
  const openEditSignatureThresholdModal = (newOwner) => {
    modalContext.openModal(
      <EditSignatureThreshold
        safeOwners={verifiedSafeOwners}
        threshold={threshold}
        newOwner={newOwner}
        onCancel={() => modalContext.closeModal()}
        onReview={(newOwner, newThreshold) =>
          openReviewEditsModal(newOwner, newThreshold, () =>
            openEditSignatureThresholdModal(newOwner)
          )
        }
      />
    );
  };
  const openReviewEditsModal = (newOwner, newThreshold, onBack) => {
    modalContext.closeModal();
    modalContext.openModal(
      <ReviewSafeEdits
        safeOwners={verifiedSafeOwners}
        threshold={threshold}
        newOwner={newOwner}
        newThreshold={newThreshold}
        onBack={onBack}
        onSubmit={onReviewSafeEditsSubmit}
      />
    );
  };
  const onReviewSafeEditsSubmit = async (newOwner, newThreshold) => {
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

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };
  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Signature Threshold</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="mr-5 is-flex">
          <SignatureBar threshold={threshold} safeOwners={verifiedSafeOwners} />
        </div>
        <div className="flex-1">
          {threshold} out of {verifiedSafeOwners?.length} signatures are
          required to confirm a new transaction
        </div>
        <div>
          <span
            className="is-underlined pointer"
            onClick={() => openEditSignatureThresholdModal()}
          >
            Edit
          </span>
        </div>
      </div>
    </div>
  );
};
export default SignatureThreshold;
