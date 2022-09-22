import React, { useState, useContext } from "react";
import { useAddressValidation } from "hooks";
import Svg from "library/Svg";
import { isAddr } from "utils";
import { Web3Context } from "contexts/Web3";

const RemoveSafeOwner = ({ safeOwner, onCancel, onSubmit }) => {
  const web3 = useContext(Web3Context);
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [address, setAddress] = useState(safeOwner.address);
  const [addressValid, setAddressValid] = useState(true);
  const isFormValid = addressValid;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(isAddr(newAddress) && (await isAddressValid(newAddress)));
  };

  const onSubmitClick = () => {
    onSubmit({ name: safeOwner.name, address });
  };

  const submitButtonClasses = [
    "button flex-1 is-primary",
    isFormValid ? "" : "disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Remove Owner</h2>
        <p className="has-text-grey">
          This user will no longer be able to sign transactions
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column mt-4">
          <label className="has-text-grey mb-2">
            Address<span className="has-text-red">*</span>
          </label>
          <div style={{ position: "relative" }}>
            <input
              className="p-4 rounded-sm column is-full border-light"
              type="text"
              placeholder="Enter user's FLOW address"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
            {addressValid && (
              <div style={{ position: "absolute", right: 17, top: 14 }}>
                <Svg name="Check" />
              </div>
            )}
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 is-border mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
            className={submitButtonClasses.join(" ")}
            onClick={onSubmitClick}
          >
            Remove
          </button>
        </div>
      </div>
    </>
  );
};

export default RemoveSafeOwner;
