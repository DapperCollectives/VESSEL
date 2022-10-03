import React, { useState } from 'react';
import { useModalContext } from 'contexts';
import { InputAddress } from 'library/components';
import { formatAddress } from 'utils';
import Svg from 'library/Svg';
import EditThreshold from '../EditThreshold';

const AddSafeOwner = ({ treasury, safeOwners }) => {
  const { openModal, closeModal } = useModalContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressValid, setAddressValid] = useState(false);

  const addressValidClass = addressValid ? 'is-success' : 'is-error';
  const nextButtonClasses = `button flex-1 is-primary ${
    addressValid ? 'has-text-weight-bold' : 'disabled'
  }`;

  const onAddressChange = async ({ value, isValid }) => {
    setAddress(value);
    setAddressValid(isValid && !isAddressExisting(safeOwners, value));
  };

  const isAddressExisting = (safeOwners, newAddress) => {
    const address = formatAddress(newAddress);
    return (
      safeOwners.filter((obj) => obj.address === address && obj.verified)
        .length !== 0
    );
  };

  const onNextClick = () => {
    openModal(
      <EditThreshold treasury={treasury} newOwner={{ address, name }} />,
      { headerTitle: 'Set A New Threshold' }
    );
  };

  const onCancelClick = () => closeModal();

  return (
    <>
      <div className="border-light-bottom p-5 has-text-grey">
        <div className="flex-1 is-flex is-flex-direction-column mb-4">
          <label className="has-text-grey mb-2 with-icon is-flex is-align-items-center">
            Address
            <span className="has-text-red">*</span>{' '}
            <Svg name="QuestionMark" className="ml-1" />
          </label>
          <InputAddress
            className={addressValidClass}
            value={address}
            onChange={onAddressChange}
            isValid={addressValid}
          />
        </div>
        <div className="flex-1 is-flex is-flex-direction-column">
          <label className="has-text-grey mb-2 is-flex is-align-items-center">
            Name <Svg name="QuestionMark" className="ml-1" />
          </label>
          <input
            className="input p-4 rounded-sm border-light is-size-6"
            type="text"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        <div className="is-flex is-align-items-center p-5">
          <button
            className="button flex-1 is-border mr-2 has-text-weight-bold"
            onClick={onCancelClick}
          >
            Cancel
          </button>
          <button
            disabled={!addressValid}
            className={nextButtonClasses}
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
