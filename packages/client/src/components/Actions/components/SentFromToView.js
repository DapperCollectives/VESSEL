import Svg from "library/Svg";
import { useClipboard, useContacts } from "hooks";
import { getNameByAddress } from "utils";

const SentFromToView = ({ safeData, recipient }) => {
  const { name: safeName, address: safeAddress } = safeData;

  const clipboard = useClipboard();
  const { contacts } = useContacts(safeAddress);

  return (
    <>
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
            {getNameByAddress(contacts, recipient)}
          </span>
          <div>
            <span className="has-text-grey">{recipient}</span>
            <span className="pointer" onClick={() => clipboard.copy(recipient)}>
              <Svg name="Copy" className="mt-1 ml-2 pointer" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SentFromToView;
