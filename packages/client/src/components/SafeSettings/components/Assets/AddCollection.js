import { useState } from "react";
import InputAddress from "../../../InputAddress";

const AddCollection = ({ onCancel, onNext }) => {
  const [contractName, setContractName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const isFormValid = contractName?.trim().length > 0 && addressValid;

  const onAddressChange = ({ value, isValid }) => {
    setAddress(value);
    setAddressValid(isValid);
  };

  const onNextClick = () => {
    onNext({
      contractName,
      address,
    });
  };

  const nextButtonClasses = [
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <div className="p-5 has-text-grey">
      <div className="flex-1 is-flex is-flex-direction-column">
        <label className="has-text-grey mb-2">NFT Contract Address</label>
        <InputAddress
          value={address}
          isValid={addressValid}
          onChange={onAddressChange}
        />
        <div className="flex-1 is-flex is-flex-direction-column mt-4">
          <label className="has-text-grey mb-2">NFT Collection Name</label>
          <input
            className="p-4 is-full rounded-sm border-light"
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-5 has-text-gray">
        <p>
          Adding a new NFT collection type enables receiving NFTs of that type
          into your treasury.
        </p>
      </div>
      <div className="is-flex is-align-items-center mt-5">
        <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button
          disabled={!isFormValid}
          className={nextButtonClasses.join(" ")}
          onClick={onNextClick}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
export default AddCollection;
