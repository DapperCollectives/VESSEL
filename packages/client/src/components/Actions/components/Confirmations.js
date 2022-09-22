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
        <div
          className="confirmation is-flex is-flex-direction-row is-justify-content-flex-start"
          key={key}
        >
          <Svg name="Status" className={`mt-1 ${confirmations[key]}`} />
          {name ? `${displayName}·${displayAddress}` : displayAddress}
        </div>
      );
    });
  };

  return (
    <div className="p-4">
      <div className="columns">
        <span className="column pl-0">Confirmations</span>
        <span className="column has-text-right">
          {getNumberOfConfirmations()}
        </span>
      </div>
      <div className="confirmations has-text-black">
        {getConfirmationList()}
      </div>
    </div>
  );
};

export default Confirmations;
