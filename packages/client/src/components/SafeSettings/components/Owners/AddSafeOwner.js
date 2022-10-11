import React, { useContext, useState } from 'react';
import { useModalContext } from 'contexts';
import { Web3Context } from 'contexts/Web3';
import { useAddressValidation } from 'hooks';
import { formatAddress, isAddr } from 'utils';
import Svg from 'library/Svg';
import EditThreshold from '../EditThreshold';

const AddSafeOwner = ({ treasury, safeOwners }) => {
  const web3 = useContext(Web3Context);
  const { openModal, closeModal } = useModalContext();
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressValid, setAddressValid] = useState(false);

  const addressValidClass = addressValid ? 'is-success' : 'is-error';
  const addrInputClasses = `input p-4 rounded-sm column is-full is-size-6 ${
    address.length > 0 ? addressValidClass : ''
  }`;
  const nextButtonClasses = `button flex-1 is-primary ${
    addressValid ? 'has-text-weight-bold' : 'disabled'
  }`;

  const onAddressChange = async (newAddress) => {
    setAddress(newAddress);
    const isValid =
      isAddr(newAddress) &&
      (await isAddressValid(newAddress)) &&
      !isAddressExisting(safeOwners, newAddress);
    setAddressValid(isValid);
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
          <div style={{ position: 'relative' }}>
            <input
              className={addrInputClasses}
              type="text"
              placeholder=""
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
            />
            {addressValid && (
              <div style={{ position: 'absolute', right: 17, top: 19 }}>
                <Svg name="Check" height="15" width="15" />
              </div>
            )}
          </div>
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
