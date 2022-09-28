import { useState } from "react";
import { COIN_TYPE_TO_META } from "constants/maps";
import { Dropdown } from "library/components";
import { useVaults } from "hooks";
import Svg from "library/Svg";

const AddVault = ({ address, onCancel, onNext }) => {
  const [selectedCoinType, setSelectedCoinType] = useState();
  const onNextClick = () => {
    onNext({
      selectedCoinType,
    });
  };
  const vaultProps = useVaults(address);
  const vaultName = COIN_TYPE_TO_META[selectedCoinType]?.vaultName;

  const isExistingVault = vaultProps.vaults[address]?.find(
    (id) => id.indexOf(vaultName) >= 0
  );
  const isFormValid = vaultName && !isExistingVault;

  const isDisabled = isFormValid ? "" : "disabled";

  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));
  const renderOption = ({ itemValue, displayText }) => (
    <span className="is-flex is-align-items-center">
      <Svg name={itemValue} className="mr-2" />
      <span className="has-text-weight-bold has-text-black">{displayText}</span>
    </span>
  );
  return (
    <div className="p-5 has-text-grey">
      <div className="flex-1 is-flex is-flex-direction-column">
        <p className="has-text-grey mb-2">Tokens</p>
        <Dropdown
          selectedValue={selectedCoinType}
          options={coinTypes}
          setOption={setSelectedCoinType}
          defaultText="Select Token"
          renderOption={renderOption}
        />
        {vaultName && !isFormValid && (
          <p className="has-text-red mt-2">
            This vault has already been added.
          </p>
        )}
      </div>
      <div className="is-flex is-align-items-center mt-6">
        <button
          type="button"
          className="button flex-1 is-border mr-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`button flex-1 is-primary ${isDisabled}`}
          disabled={!isFormValid}
          onClick={onNextClick}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
export default AddVault;
