import { useContext } from "react";
import { Web3Context } from "contexts/Web3";
import { SendTokensContext } from "../sendTokensContext";
import { useAddressValidation } from "hooks";
import { Check } from "components/Svg";
import { isAddr, formatAddress } from "utils";
const AddressInput = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const { recipient, recipientValid } = sendModalState;
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const onrecipientChange = async (e) => {
    let newValue = e.target.value;
    let isValid = isAddr(e.target.value);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(e.target.value));
    }
    setSendModalState((prevState) => ({
      ...prevState,
      recipient: newValue,
      recipientValid: isValid,
    }));
  };

  return (
    <div>
      <label className="has-text-grey mb-2">
        Address <span className="has-text-red"> *</span>
      </label>

      <div className="is-flex">
        <div className="flex-1" style={{ position: "relative" }}>
          <input
            style={{ height: 48 }}
            className="border-light rounded-sm column is-full p-2 mt-2"
            type="text"
            value={recipient}
            onChange={onrecipientChange}
          />
          {recipientValid && (
            <div style={{ position: "absolute", right: 17, top: 20 }}>
              <Check />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AddressInput;
