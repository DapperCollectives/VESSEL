import { useContext } from "react";
import { Web3Context } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { Dropdown } from "library/components";
import { isAddr, formatAddress } from "utils";
import { SendTokensContext } from "../sendTokensContext";

const AddressDropdown = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const { recipient, address } = sendModalState;
  const { safeOwners } = web3?.treasuries?.[address];
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const dropdownOptions = safeOwners.map(({ address }) => ({
    displayText: address,
    itemValue: address,
  }));
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

  const renderOption = ({ itemValue, displayText }) => (
    <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
      <span className="has-text-weight-bold has-text-black">{displayText}</span>
      <span className="has-text-black">
        {getSafeOwnerNameByAddress(itemValue)}
      </span>
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
        options={dropdownOptions}
        setOption={onrecipientChange}
        renderOption={renderOption}
        withSearch
        withInput
        searchInputPlaceholder="Search or Enter Address"
      />
    </div>
  );
};
export default AddressDropdown;
