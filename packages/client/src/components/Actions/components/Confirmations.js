import Svg from "library/Svg";
import { useContacts } from "hooks";
import { getSafeContactName, shortenAddr, shortenName } from "utils";

const Confirmations = ({ confirmations, safeData }) => {
  const { address: safeAddress } = safeData;

  const { contacts } = useContacts(safeAddress);

  const getNumberOfConfirmations = () => {
    const numberApproved = Object.keys(confirmations).filter(
      (key) => confirmations[key] === "approved"
    )?.length;

    return `${numberApproved} out of ${Object.keys(confirmations).length}`;
  };

  const getConfirmationList = () => {
    return Object.keys(confirmations).map((key) => {
      const name = getSafeContactName(contacts, key);
      return (
        <div className="confirmation">
          <Svg name="Status" className={`${confirmations[key]}`} />
          {name?.length > 20 ? shortenName(name) : name}
          {name ? `·${shortenAddr(key)}` : key}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="column is-flex">
        <span className="flex-1">Confirmations</span>
        <span className="is-justify-content-end">
          {getNumberOfConfirmations()}
        </span>
      </div>
      <div className="column is-flex confirmations has-text-black">
        {getConfirmationList()}
      </div>
    </div>
  );
};

export default Confirmations;
