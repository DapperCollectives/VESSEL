import React from "react";
import { useModalContext } from "contexts";
import { useClipboard } from "hooks";
import RemoveSafeOwner from "./RemoveSafeOwner";
import AddSafeOwner from "./AddSafeOwner";
import Svg from "library/Svg";

const Owners = ({ treasury }) => {
  const modalContext = useModalContext();
  const { safeOwners } = treasury;
  const verifiedSafeOwners = safeOwners.filter((o) => o.verified);
  const ownersAddressClipboard = useClipboard();

  const openAddOwnerModal = () => {
    modalContext.openModal(
      <AddSafeOwner
        treasury={treasury}
        safeOwners={safeOwners}
      />
    );
  };

  const openRemoveOwnerModal = (safeOwner) => {
    modalContext.openModal(
      <RemoveSafeOwner
        treasury={treasury}
        owner={safeOwner}
        safeOwners={safeOwners}
      />
    );
  };

  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full is-justify-content-space-between">
        <h2>Owners</h2>
        <button
          className="button is-secondary is-small with-icon"
          onClick={openAddOwnerModal}
        >
          Add new owner
          <Svg name="Plus" />
        </button>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow table-border">
        {Array.isArray(verifiedSafeOwners) &&
          verifiedSafeOwners.map((so, idx) => (
            <div
              className="is-flex column is-full p-5"
              key={idx}
            >
              <div className="px-2 mr-6" style={{ minWidth: 120 }}>
                {so.name ?? `Signer #${idx + 1}`}
              </div>
              <div className="flex-1">{so.address}</div>
              <div>
                <button
                  className="button is-transparent"
                  onClick={() => ownersAddressClipboard.copy(so.address)}
                >
                  {ownersAddressClipboard.textJustCopied === so.address
                    ? "Copied"
                    : "Copy Address"}
                </button>
                <span
                  className="button is-transparent"
                  onClick={() => openRemoveOwnerModal(so)}
                >
                  Remove
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Owners;
