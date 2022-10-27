import React from 'react';
import { Web3Consumer } from 'contexts/Web3';
import { useAddressValidation } from 'hooks';
import { formatAddress, isAddr } from 'utils';
import Svg from 'library/Svg';

const InputAddress = ({
  web3,
  value,
  isValid,
  onChange,
  className = '',
  readOnly = false,
}) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const onValueChange = async (e) => {
    const { value } = e.target;
    let isValid = isAddr(value);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(value));
    }
    // if address is valid, autoformat prefix with 0x
    onChange({ value: isValid ? formatAddress(value) : value, isValid });
  };

  const addressValidClass = isValid ? "is-success" : "is-error";
  const inputClassName = value.length ? addressValidClass : "";

  return (
    <div className={`is-flex ${className}`}>
      <div className="flex-1" style={{ position: 'relative' }}>
        <input
          className={`border-light rounded-sm column is-full p-4 ${inputClassName}`}
          type="text"
          value={value}
          onChange={onValueChange}
          disabled={readOnly}
        />
        {isValid && (
          <div
            className="is-flex is-align-items-center"
            style={{ position: 'absolute', right: 15, top: 0, height: '100%' }}
          >
            <Svg name="Check" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3Consumer(InputAddress);
