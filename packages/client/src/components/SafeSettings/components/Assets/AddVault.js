import { useState } from "react";
import { COIN_TYPE_TO_META } from "constants/maps";
import Dropdown from "components/Dropdown";
const AddVault = ({ onCancel, onNext }) => {
  const onNextClick = () => {
    onNext({
      coinType,
    });
  };

  const nextButtonClasses = ["button flex-1 p-4", "is-link"];

  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));

  const [coinType, setCoinType] = useState(coinTypes[0].itemValue);

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add Vault</h2>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">Contract Name</label>
          <Dropdown
            value={coinType}
            values={coinTypes}
            setValue={setCoinType}
            style={{ height: "45px" }}
          />
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button className={nextButtonClasses.join(" ")} onClick={onNextClick}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};
export default AddVault;
