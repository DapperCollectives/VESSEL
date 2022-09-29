import { useContext, useState } from "react";
import { Web3Context } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { Dropdown } from "library/components";
import { isAddr, formatAddress } from "utils";
import { SendTokensContext } from "../sendTokensContext";

const MOCK_SAFEOWNERS = [
  {
    name: "test",
    address: "01cf0e2f2f715450",
  },
  {
    name: "test2",
    address: "f3fcd2c1a78f5eee",
  },
  {
    name: "test3",
    address: "f8d6e0586b0a20c7",
  },
];
const AddressDropdown = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const { recipient, address } = sendModalState;
  // const { safeOwners } = web3?.treasuries?.[address];
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const safeOwners = MOCK_SAFEOWNERS;
  const dropdownOptions = safeOwners.map(({ address }) => ({
    displayText: address,
    itemValue: address,
  }));
  const [filteredOptions, setFilteredOptions] = useState(dropdownOptions);

  const onrecipientChange = async (itemValue) => {
    let isValid = isAddr(itemValue);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(itemValue));
    }
    setSendModalState((prevState) => ({
      ...prevState,
      recipient: itemValue,
      recipientValid: isValid,
    }));
  };
  const getSafeOwnerNameByAddress = (ownerAddress) =>
    safeOwners.find((owner) => owner.address === ownerAddress).name;

  const handleAddressSearchEnter = (e) => {
    const entry = e.target.value;
    const newFilteredOptions = dropdownOptions.filter(
      ({ itemValue, displayText }) =>
        displayText.indexOf(entry) >= 0 || itemValue.indexOf(entry) >= 0
    );
    setFilteredOptions(newFilteredOptions);
  };

  const renderOption = ({ itemValue, displayText }) => (
    <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
      <span className="has-text-weight-bold has-text-black">{displayText}</span>
      <span className="has-text-black">
        {getSafeOwnerNameByAddress(itemValue)}
      </span>
    </div>
  );
  const renderAddressSearchInput = () => (
    <div className="is-flex is-justify-content-space-around">
      <input
        className="input mb-4 dropdown-input"
        style={{ width: "80%", height: "58px" }}
        type="text"
        placeholder="Search or enter address"
        onChange={handleAddressSearchEnter}
      />
    </div>
  );
  return (
    <div className="px-5">
      <p className="has-text-grey mb-2">
        Address
        <span className="has-text-red"> *</span>
      </p>

      <Dropdown
        defaultText="Select Address"
        selectedValue={recipient}
        options={filteredOptions}
        setOption={onrecipientChange}
        renderOption={renderOption}
        renderCustomSearchOrInput={renderAddressSearchInput}
      />
    </div>
  );
};
export default AddressDropdown;
