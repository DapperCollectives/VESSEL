import React from "react";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { useClipboard } from "hooks";
import EditThreshold from "../EditThreshold";
import RemoveSafeOwner from "./RemoveSafeOwner";
import AddSafeOwner from "./AddSafeOwner";
import { formatAddress } from "utils";

const Owners = ({ treasury, proposeRemoveSigner }) => {
  const modalContext = useModalContext();
  const history = useHistory();
  const { safeOwners, address } = treasury;
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  const ownersAddressClipboard = useClipboard();

  const onRemoveSafeOwnerSubmit = async (ownerToBeRemoved) => {
    if (ownerToBeRemoved) {
      await proposeRemoveSigner(formatAddress(ownerToBeRemoved.address));
    }

    modalContext.closeModal();
    history.push(`/safe/${address}`);
  };
  const openRemoveOwnerModal = (safeOwner) => {
    modalContext.openModal(
      <RemoveSafeOwner
        safeOwner={safeOwner}
        onCancel={() => modalContext.closeModal()}
        onSubmit={onRemoveSafeOwnerSubmit}
      />
    );
  };
  const openAddOwnerModal = () => {
    modalContext.openModal(
      <AddSafeOwner
        onCancel={() => modalContext.closeModal()}
        onNext={openEditSignatureThresholdModal}
        safeOwners={safeOwners}
      />
    );
  };

  const openEditSignatureThresholdModal = (newOwner) => {
    modalContext.openModal(
      <EditThreshold treasury={treasury} newOwner={newOwner} />
    );
  };
  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Owners</h4>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {Array.isArray(verifiedSafeOwners) &&
          verifiedSafeOwners.map((so, idx) => (
            <div
              className="is-flex column is-full p-5 border-light-bottom"
              key={idx}
            >
              <div className="px-2 mr-6" style={{ minWidth: 120 }}>
                {so.name ?? `Signer #${idx + 1}`}
              </div>
              <div className="flex-1">{so.address}</div>
              <div>
                <span
                  className="is-underlined mr-5 pointer"
                  onClick={() => ownersAddressClipboard.copy(so.address)}
                >
                  {ownersAddressClipboard.textJustCopied === so.address
                    ? "Copied"
                    : "Copy Address"}
                </span>
                <span
                  className="is-underlined pointer"
                  onClick={() => openRemoveOwnerModal(so)}
                >
                  Remove
                </span>
              </div>
            </div>
          ))}
      </div>
      <button
        style={{ width: "100%" }}
        className="button mt-4 p-4 border-light is-full"
        onClick={openAddOwnerModal}
      >
        Add new owner
      </button>
    </div>
  );
};
export default Owners;
