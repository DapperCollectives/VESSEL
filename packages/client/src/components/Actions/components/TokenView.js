import { useClipboard, useContacts } from "hooks";
import Svg from "library/Svg";
import { getSafeContactName, getTokenMeta } from "utils";

const TokenView = ({ actionView, safeData }) => {
  const { recipient, vaultId, tokenAmount } = actionView;
  const { name: safeName, address: safeAddress } = safeData;

  const { displayName, tokenType } = getTokenMeta(vaultId) || {};

  const clipboard = useClipboard();
  const { contacts } = useContacts(safeAddress);

  return (
    <>
      <div className="pl-4 mb-4">
        <span className="columns">Amount</span>
        <span className="columns is-size-2 is-family-monospace has-text-black">
          {Number(tokenAmount)}
        </span>
        <span className="columns is-size-6 has-text-weight-bold has-text-black">
          <Svg name={tokenType} /> &nbsp; {displayName}
        </span>
      </div>
      <div className="mt-4 border-light-top">
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="flex-1 has-text-grey">Sent From</span>
          <div className="flex-1">
            <span className="has-text-weight-bold has-text-black">
              {safeName}
            </span>
            <div>
              <span className="has-text-grey">{safeAddress}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(safeAddress)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="has-text-grey flex-1">Sent To</span>
          <div className="flex-1">
            <span className="has-text-weight-bold has-text-black">
              {getSafeContactName(contacts, recipient)}
            </span>
            <div>
              <span className="has-text-grey">{recipient}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(recipient)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TokenView;
