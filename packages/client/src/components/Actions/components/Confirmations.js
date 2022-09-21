import Svg from "library/Svg";
import { getNameByAddress, shortenAddr, shortenName } from "utils";

const Confirmations = ({ confirmations, safeData }) => {
  const { safeOwners } = safeData;

  const getNumberOfConfirmations = () => {
    const numberApproved = Object.keys(confirmations).filter(
      (key) => confirmations[key] === "approved"
    ).length;

    return `${numberApproved} out of ${Object.keys(confirmations).length}`;
  };

  const getConfirmationList = () => {
    return Object.keys(confirmations).map((key) => {
      const name = getNameByAddress(safeOwners, key);
      const displayName = name?.length > 20 ? shortenName(name) : name;
      const displayAddress = name ? shortenAddr(key) : key;
      return (
        <div className="confirmation" key={key}>
          <Svg name="Status" className={`${confirmations[key]}`} />
          {name ? `${displayName}·${displayAddress}` : displayAddress}
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
