import React from "react";
import { useModalContext } from "contexts";
import { useClipboard } from "hooks";
import EditSafeName from "./EditSafeName";
const SafeDetailsSetting = ({ treasury, setTreasury }) => {
  const modalContext = useModalContext();
  const { name, address } = treasury;
  const safeAddressClipboard = useClipboard();
  const openEditNameModal = () => {
    modalContext.openModal(
      <EditSafeName
        name={name}
        onCancel={() => modalContext.closeModal()}
        onSubmit={onEditNameSubmit}
      />
    );
  };
  const onEditNameSubmit = (newName) => {
    setTreasury(address, { name: newName });
    modalContext.closeModal();
  };
  return (
    <div>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Safe Details</h4>
      </div>
      <div className="column p-5 mt-4 mb-5 is-flex is-full rounded-sm border-light has-shadow">
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Name</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{name}</div>
            <button
              className="button is-transparent"
              onClick={openEditNameModal}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="border-light-right pr-5 mr-5 flex-1">
          <div className="has-text-grey">Address</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>{address}</div>
            <button
              className="button is-transparent"
              onClick={() => safeAddressClipboard.copy(address)}
            >
              {safeAddressClipboard.textJustCopied === address
                ? "Copied"
                : "Copy"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="has-text-grey">Contract Version</div>
          <div className="mt-1 is-flex is-justify-content-space-between">
            <div>Flow 1.2</div>
            <button className="button is-transparent">Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SafeDetailsSetting;
