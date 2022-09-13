import { useState } from "react";
import { COIN_TYPE_TO_META } from "constants/maps";
import Dropdown from "components/Dropdown";
import { useVaults } from "hooks";

const AddVault = ({ address, onCancel, onNext }) => {
  const onNextClick = () => {
    onNext({
      selectedCoinType,
    });
  };
  const vaultProps = useVaults(address);

  const [selectedCoinType, setSelectedCoinType] = useState();
  const vaultName = COIN_TYPE_TO_META[selectedCoinType]?.vaultName;

  const isFormValid =
    vaultName &&
    !vaultProps.vaults[address]?.find((id) => id.indexOf(vaultName) >= 0);

  const isDisabled = isFormValid ? "" : "disabled";

  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));

  return (
    <div className="p-5 has-text-grey">
      <div className="flex-1 is-flex is-flex-direction-column">
        <label className="has-text-grey mb-2">Tokens</label>
        <Dropdown
          value={selectedCoinType}
          values={coinTypes}
          setValue={setSelectedCoinType}
          style={{ height: "45px" }}
          defaultText="Select Token"
        />
        {vaultName && !isFormValid && (
          <p className="has-text-red mt-2">
            This vault has already been added.
          </p>
        )}
      </div>
      <div className="is-flex is-align-items-center mt-6">
        <button className="button flex-1 is-border mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button
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
