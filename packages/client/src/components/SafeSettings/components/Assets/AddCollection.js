import { useState, useContext } from "react";
import { Web3Context } from "contexts/Web3";
import { useAddressValidation } from "hooks";
import { isAddr } from "utils";
import { Check, Close } from "components/Svg";

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
    "button flex-1 p-4",
    isFormValid ? "is-link" : "is-light is-disabled",
  ];

  return (
    <>
      <div className="px-5 pt-5 columns is-vcentered is-multiline is-mobile">
        <h2 className="is-size-4 has-text-black column">Add NFT Collection</h2>
        <span className="pointer" onClick={onCancel}>
          <Close className="mr-4" />
        </span>
      </div>
      <div className="border-light-top p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2">NFT Contract Address</label>
          <input
            className="p-4 rounded-sm column is-full border-light"
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
          {addressValid && (
            <div style={{ position: "absolute", right: 17, top: 14 }}>
              <Check />
            </div>
          )}
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
          <p>Adding a new NFT collection type enables receiving NFTs of that type into your treasury.</p>
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
    </>
  );
};
export default AddCollection;
