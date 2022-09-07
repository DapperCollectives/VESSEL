import { useState } from "react";
import { COIN_TYPE_TO_META } from "constants/maps";
import Dropdown from "components/Dropdown";
import { Close } from "components/Svg";

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

  const [coinType, setCoinType] = useState("Select Token");

  return (
    <>
      <div className="px-5 pt-5 columns is-vcentered is-multiline is-mobile">
        <h2 className="is-size-4 has-text-black column">Add Token Vault</h2>
        <span className="pointer" onClick={onCancel}>
          <Close className="mr-4" />
        </span>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">Tokens</label>
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
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};
export default AddVault;
