import { useState, useContext } from "react";
import { Web3Context } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { isAddr } from "utils";
import Svg from "library/Svg";
const AddCollection = ({ onCancel, onNext }) => {
  const web3 = useContext(Web3Context);
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [contractName, setContractName] = useState("");
  const [address, setAddress] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const isFormValid = contractName?.trim().length > 0 && addressValid;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    setAddressValid(isAddr(newAddress) && (await isAddressValid(newAddress)));
  };

  const onNextClick = () => {
    onNext({
      contractName,
      address,
    });
  };

  const nextButtonClasses = [
    "button flex-1 is-primary",
    isFormValid ? "" : "disabled",
  ];

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Add Collection</h2>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">Contract Name</label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
          />
          <div className="flex-1 is-flex is-flex-direction-column mt-4">
            <label className="has-text-grey mb-2">Contract Address</label>
            <div style={{ position: "relative" }}>
              <input
                className="p-4 rounded-sm column is-full border-light"
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
              />
              {addressValid && (
                <div style={{ position: "absolute", right: 17, top: 14 }}>
                  <Svg nam="Check" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="is-flex is-align-items-center mt-6">
          <button className="button is-border flex-1 mr-2" onClick={onCancel}>
            Cancel
          </button>
          <button
            disabled={!isFormValid}
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
export default AddCollection;
