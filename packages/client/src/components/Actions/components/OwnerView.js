import { useContacts } from "hooks";
import { getNameByAddress } from "utils";
import ProposedDateView from "./ProposedDateView";

const OwnerView = ({ actionView, safeData, isAdd }) => {
  const { signerAddr, timestamp } = actionView;
  const { address: safeAddress } = safeData;

  const { contacts } = useContacts(safeAddress);
  const signerName = getNameByAddress(contacts, signerAddr);

  return (
    <div className="mb-4">
      <span className="column">{isAdd ? "New Owner" : "Remove Owner"}</span>
      {signerName && (
        <>
          <span className="column is-size-2 is-family-monospace has-text-black has-text-weight-bold">
            {signerName}
          </span>
          <span className="column is-size-6 has-text-weight-bold has-text-black">
            {signerAddr}
          </span>
        </>
      )}
      {!signerName && (
        <span className="column is-size-3 is-family-monospace has-text-black has-text-weight-bold">
          {signerAddr}
        </span>
      )}
      <ProposedDateView timestamp={timestamp} />
    </div>
  );
};
export default OwnerView;
