import React, { useState, useContext } from "react";
import { useAddressValidation } from "hooks";
import { isAddr, formatAddress } from "utils";
import { Check } from "components/Svg";
import { Web3Context } from "contexts/Web3";

const AddSafeOwner = ({ onCancel, onNext, safeOwners }) => {
  const web3 = useContext(Web3Context);
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(
      isAddr(newAddress) &&
        (await isAddressValid(newAddress)) &&
        !isAddressExisting(safeOwners, newAddress)
    );
  };

  const isAddressExisting = (safeOwners, newAddress) => {
    const address = formatAddress(newAddress);
    return (
      safeOwners.filter((obj) => obj.address === address && obj.verified)
        .length !== 0
    );
  };

  const onNextClick = () => {
    onNext({
      name,
      address,
    });
  };

  const nextButtonClasses = [
    "button flex-1 is-primary",
    addressValid ? "" : "disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add a new safe owner</h2>
        <p className="has-text-grey">
          Heads up, they'll have full access to this safe
        </p>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">Owner Name</label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            placeholder="Enter local owner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
                <Check />
              </div>
            )}
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 is-border mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isAddressValid}
            className={nextButtonClasses.join(" ")}
            onClick={onNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AddSafeOwner;
