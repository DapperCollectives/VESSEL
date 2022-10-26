import { useState } from 'react';
import { InputAddress } from 'library/components';

const AddCollection = ({ onCancel, onNext }) => {
  const [contractName, setContractName] = useState('');
  const [address, setAddress] = useState('');
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

  const isDisabled = isFormValid ? '' : 'disabled';

  return (
    <div className="has-text-grey">
      <div className="p-5 flex-1 is-flex is-flex-direction-column">
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
      <div className="px-5 pb-5 has-text-gray">
        <p>
          Adding a new NFT collection type enables receiving NFTs of that type
          into your treasury.
        </p>
      </div>
      <div className="is-flex is-align-items-center p-5 border-light-top">
        <button
          type="button"
          className="button is-border flex-1 mr-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`button flex-1 is-primary ${isDisabled}`}
          disabled={!isFormValid}
          onClick={onNextClick}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
export default AddCollection;
