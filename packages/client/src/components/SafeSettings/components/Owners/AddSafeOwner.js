import React, { useState, useContext } from "react";
import { useAddressValidation } from "hooks";
import { isAddr, formatAddress } from "utils";
import Svg from "library/Svg";
import { Web3Context } from "contexts/Web3";

const AddSafeOwner = ({ onCancel, onNext, safeOwners }) => {
  const web3 = useContext(Web3Context);
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [addressBorderClass, setAddressBorderClass] = useState("border-light");

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    const isValid = isAddr(newAddress) &&
      (await isAddressValid(newAddress)) &&
      !isAddressExisting(safeOwners, newAddress)
    setAddressValid(isValid);

    if (isValid) {
      setAddressBorderClass("border-success")
    }
    else if (newAddress.length === 0) {
      setAddressBorderClass("border-light")
    }
    else {
      setAddressBorderClass("border-error");
    }
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
    "button flex-1 is-primary ",
    addressValid ? "has-text-weight-bold" : "disabled",
  ];
  const addrInputClasses = [
    "p-4 rounded-sm column is-full is-size-6",
    addressBorderClass
  ]

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add owner</h2>
      </div>
      <div className="border-light-top border-light-bottom p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column mb-4">
          <label className="has-text-grey mb-2 with-icon">
            Address<span className="has-text-red">*</span> <Svg name="QuestionMark" style={{position: "relative", top: 4 }} />
          </label>
          <div style={{ position: "relative" }}>
            <input
              className={addrInputClasses.join(" ")}
              type="text"
              placeholder=""
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
            {addressValid && (
              <div
                style={{ position: "absolute", right: 17, top: 19 }}
              >
                <Svg name="Check" height="15" width="15" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">
            Name <Svg name="QuestionMark" style={{position: "relative", top: 4 }} />
          </label>
          <input
            className="p-4 rounded-sm border-light is-size-6"
            type="text"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        <div className="is-flex is-align-items-center p-5">
          <button className="button flex-1 is-border mr-2 has-text-weight-bold" onClick={onCancel}>
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
