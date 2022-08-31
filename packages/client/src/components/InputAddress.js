import React from "react";
import { Web3Consumer } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { Check } from "components/Svg";
import { isAddr, formatAddress } from "utils";

const InputAddress = ({ web3, value, isValid, onChange }) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const onValueChange = async (e) => {
    const { value } = e.target;
    let isValid = isAddr(value);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(value));
    }
    onChange({ value, isValid });
  };

  return (
    <div className="is-flex">
      <div className="flex-1" style={{ position: "relative" }}>
        <input
          style={{ height: 48 }}
          className="border-light rounded-sm column is-full p-2 mt-2"
          type="text"
          value={value}
          onChange={onValueChange}
        />
        {isValid && (
          <div style={{ position: "absolute", right: 17, top: 20 }}>
            <Check />
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3Consumer(InputAddress);

