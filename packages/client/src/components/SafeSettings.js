import React, { useMemo, useState } from "react";
import { useModalContext } from "../contexts";
import { useClipboard } from "../hooks";

const EditSafeName = ({ name, onCancel, onSubmit }) => {
  const [currSafeName, setCurrSafeName] = useState(name);
  const isNameValid = useMemo(
    () => currSafeName.trim().length > 0,
    [currSafeName]
  );

  const onSubmitClick = () => {
    onSubmit(currSafeName);
  };

  const submitButtonClasses = [
    "button flex-1 p-4",
    isNameValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="p-5 has-text-black">
        <h2 className="is-size-4">Edit safe name</h2>
        <p className="has-text-grey">Update the local name of your safe</p>
      </div>
      <div className="border-light-top p-5">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">Name</label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            placeholder="Choose a local name for your safe"
            value={currSafeName}
            onChange={(e) => setCurrSafeName(e.target.value)}
          />
          <div className="is-flex is-align-items-center mt-6">
            <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
              Cancel
            </button>
            <button
              className={submitButtonClasses.join(" ")}
              disabled={!isNameValid}
              onClick={onSubmitClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SignatureBar = ({ threshold, safeOwners }) => (
  <div className="is-flex column p-0 is-full">
    {new Array(safeOwners?.length).fill().map((_, idx) => {
      const backgroundColor = idx + 1 <= threshold ? "black" : "#E5E5E5";
      return (
        <div
          key={idx}
          className="progress-bit mr-1"
          style={{ backgroundColor, width: 4 }}
        />
      );
    })}
  </div>
);

function SafeSettings({ address, web3, name, threshold, safeOwners }) {
  const modalContext = useModalContext();
  const safeAddressClipboard = useClipboard();
  const ownersAddressClipboard = useClipboard();
  const { setTreasury } = web3;

  const onEditNameSubmit = (newName) => {
    modalContext.closeModal();
    setTreasury(address, { name: newName });
  };

  const onEditNameClick = () => {
    modalContext.openModal(
      <EditSafeName
        name={name}
        onCancel={() => modalContext.closeModal()}
        onSubmit={onEditNameSubmit}
      />
    );
  };

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Safe Details</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Name</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{name}</div>
            <div className="is-underlined pointer" onClick={onEditNameClick}>
              Edit
            </div>
          </div>
        </div>
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Address</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{address}</div>
            <div
              className="is-underlined pointer"
              onClick={() => safeAddressClipboard.copy(address)}
            >
              {safeAddressClipboard.textJustCopied === address
                ? "Copied"
                : "Copy"}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="has-text-grey">Contract Version</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>Flow 1.2</div>
            <div className="is-underlined">Details</div>
          </div>
        </div>
      </div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Signature Threshold</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="mr-5 is-flex">
          <SignatureBar threshold={threshold} safeOwners={safeOwners} />
        </div>
        <div className="flex-1">
          {threshold} out of {safeOwners?.length} signatures are required to
          confirm a new transaction
        </div>
        <div>
          <span className="is-underlined">Edit</span>
        </div>
      </div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Owners</h4>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {Array.isArray(safeOwners) &&
          safeOwners.map((so, idx) => (
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
                <span className="is-underlined">Edit</span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default SafeSettings;
