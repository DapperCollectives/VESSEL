import { useContext, useState, useRef } from "react";
import { Web3Context } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { Dropdown } from "library/components";
import { isAddr, formatAddress } from "utils";
import Svg from "library/Svg";
import { SendTokensContext } from "../sendTokensContext";

const AddressDropdown = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const {
    recipient,
    recipientValid,
    address: treasuryAddress,
  } = sendModalState;
  const { safeOwners } = web3?.treasuries?.[treasuryAddress];
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const dropdownOptions = safeOwners
    .filter(({ verified }) => verified)
    .map(({ name, address }) => ({
      displayText: address,
      itemValue: address,
      attr: { name },
    }));
  const [filteredOptions, setFilteredOptions] = useState(dropdownOptions);
  const searchInputRef = useRef();

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

  const handleOptionSelect = (itemValue) => {
    onrecipientChange(itemValue);
    searchInputRef.current.value = "";
  };

  const handleAddressSearchEnter = (e) => {
    const entry = e.target.value;
    const newFilteredOptions = dropdownOptions.filter(
      ({ itemValue, displayText, attr }) =>
        displayText.indexOf(entry) >= 0 ||
        itemValue.indexOf(entry) >= 0 ||
        attr.name.indexOf(entry) >= 0
    );

    // we found some addresses matching the search
    // render the filtered options
    if (newFilteredOptions.length > 0) {
      setFilteredOptions(newFilteredOptions);

      // address not found
      // we treat this search box as an input
    } else {
      onrecipientChange(entry);
    }
  };

  const renderOption = (itemValue, displayText, attr) => (
    <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
      <span className="has-text-weight-bold has-text-black">
        {displayText ?? itemValue}
      </span>
      <span className="has-text-black">{attr?.name}</span>
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
        ref={searchInputRef}
      />
      {searchInputRef?.current?.value && recipientValid && (
        <div style={{ position: "absolute", right: 55, top: 20 }}>
          <Svg name="Check" />
        </div>
      )}
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
        setOption={handleOptionSelect}
        renderOption={renderOption}
        renderCustomSearchOrInput={renderAddressSearchInput}
      />
    </div>
  );
};
export default AddressDropdown;
