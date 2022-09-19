import { useContacts } from "hooks";
import { getSafeContactName } from "utils";

const OwnerView = ({ actionView, safeData, isAdd }) => {
  const { signerAddr } = actionView;
  const { address: safeAddress } = safeData;

  const { contacts } = useContacts(safeAddress);
  const signerName = getSafeContactName(contacts, signerAddr);

  return (
    <div className="pl-4 mb-4">
      <span className="columns">{isAdd ? "New Owner" : "Remove Owner"}</span>
      {signerName && (
        <>
          <span className="columns is-size-2 is-family-monospace has-text-black has-text-weight-bold">
            {signerName}
          </span>
          <span className="columns is-size-6 has-text-weight-bold has-text-black">
            {signerAddr}
          </span>
        </>
      )}
      {!signerName && (
        <span className="columns is-size-3 is-family-monospace has-text-black has-text-weight-bold">
          {signerAddr}
        </span>
      )}
    </div>
  );
};
export default OwnerView;
