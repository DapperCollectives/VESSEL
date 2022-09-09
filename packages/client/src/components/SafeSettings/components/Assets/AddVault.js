import { useState } from "react";
import { COIN_TYPE_TO_META } from "constants/maps";
import Dropdown from "components/Dropdown";
import { Close } from "components/Svg";
import { useVaults } from "hooks";

const AddVault = ({ address, onCancel, onNext }) => {
  const onNextClick = () => {
    onNext({
      coinType,
    });
  };
  const vaultProps = useVaults(address);

  const [coinType, setCoinType] = useState("Select Token");
  const vaultName = COIN_TYPE_TO_META[coinType]?.vaultName;

  const isFormValid = vaultName && !vaultProps.vaults[address]?.find(
    (id) => id.indexOf(vaultName) >= 0
  );

  const nextButtonClasses = [
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));

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
          {vaultName && !isFormValid &&
            <p className="has-text-red mt-2">This vault has already been added.</p>
          }
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
