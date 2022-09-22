import { useContacts } from "hooks";
import { getNameByAddress } from "utils";
import ProposedDateView from "./ProposedDateView";

const OwnerView = ({ actionView, safeData, isAdd }) => {
  const { signerAddr, timestamp } = actionView;
  const { address: safeAddress } = safeData;

  const { contacts } = useContacts(safeAddress);
  const signerName = getNameByAddress(contacts, signerAddr);

  return (
    <>
      <span>{isAdd ? "New Owner" : "Remove Owner"}</span>
      <div className="mb-4">
        {signerName && (
          <>
            <div>
              <span className="is-size-2 is-family-monospace has-text-black has-text-weight-bold">
                {signerName}
              </span>
            </div>
            <div>
              <span className="is-size-6 has-text-weight-bold has-text-black">
                {signerAddr}
              </span>
            </div>
          </>
        )}
        {!signerName && (
          <span className="is-size-3 is-family-monospace has-text-black has-text-weight-bold">
            {signerAddr}
          </span>
        )}
      </div>
      <ProposedDateView timestamp={timestamp} />
    </>
  );
};
export default OwnerView;
