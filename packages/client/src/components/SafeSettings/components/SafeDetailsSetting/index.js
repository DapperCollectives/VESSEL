import { useModalContext } from "contexts";
import { useClipboard, useTreasury } from "hooks";
import EditSafeName from "./EditSafeName";
const SafeDetailsSetting = ({ treasury }) => {
  const modalContext = useModalContext();
  const { name, address } = treasury;
  const safeAddressClipboard = useClipboard();
  const { setTreasury } = useTreasury(address);
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
    modalContext.closeModal();
    setTreasury(address, { name: newName });
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
            <div className="is-underlined pointer" onClick={openEditNameModal}>
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
    </div>
  );
};
export default SafeDetailsSetting;
