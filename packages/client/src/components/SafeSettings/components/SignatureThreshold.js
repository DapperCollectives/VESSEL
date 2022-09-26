import { useModalContext } from "contexts";
import SignatureBar from "./SignatureBar";
import EditThreshold from "./EditThreshold";

const SignatureThreshold = ({ treasury }) => {
  const { openModal, closeModal, isOpen } = useModalContext();
  const { threshold, safeOwners } = treasury;
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);

  const openEditSignatureThresholdModal = () => {
    if (isOpen) closeModal();
    openModal(
      <EditThreshold treasury={treasury} />,
      { headerTitle: "Set A New Threshold" }
    );
  };
  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h2>Signature Threshold</h2>
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
          <button
            className="button is-transparent"
            onClick={() => openEditSignatureThresholdModal()}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
export default SignatureThreshold;
