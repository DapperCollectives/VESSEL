import Svg from "library/Svg";
import { useClipboard, useContacts } from "hooks";
import { getNameByAddress } from "utils";

const SentFromToView = ({ safeData, recipient }) => {
  const { name: safeName, address: safeAddress } = safeData;

  const clipboard = useClipboard();
  const { contacts } = useContacts(safeAddress);

  return (
    <div className="is-size-6 has-text-grey">
      <div className="m-1 columns border-light-bottom">
        <span className="column">Sent From</span>
        <div className="column">
          <span className="has-text-weight-bold has-text-black">
            {safeName}
          </span>
          <div>
            <span>{safeAddress}</span>
            <span
              className="pointer"
              onClick={() => clipboard.copy(safeAddress)}
            >
              <Svg name="Copy" className="mt-1 ml-2" />
            </span>
          </div>
        </div>
      </div>
      <div className="m-1 columns border-light-bottom">
        <span className="column">Sent To</span>
        <div className="column">
          <span className="has-text-weight-bold has-text-black">
            {getNameByAddress(contacts, recipient)}
          </span>
          <div>
            <span>{recipient}</span>
            <span className="pointer" onClick={() => clipboard.copy(recipient)}>
              <Svg name="Copy" className="mt-1 ml-2" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentFromToView;
