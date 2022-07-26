import { useState, useContext } from "react";
import { SendTokensContext } from "../sendTokensContext";
import { useAddressValidation } from "hooks";
import { Check } from "components/Svg";
import { isAddr, formatAddress } from "utils";
const AddressInput = () => {
  const [sendModalState, setSendModalState, web3] =
    useContext(SendTokensContext);
  const [receipientValid, setReceipientValid] = useState(false);
  const { receipient } = sendModalState;
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const onReceipientChange = async (e) => {
    let newValue = e.target.value;
    setSendModalState((prevState) => ({ ...prevState, receipient: newValue }));
    let isValid = isAddr(e.target.value);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(e.target.value));
    }
    setReceipientValid(isValid);
    console.log(isValid);
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
            value={receipient}
            onChange={onReceipientChange}
          />
          {receipientValid && (
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
