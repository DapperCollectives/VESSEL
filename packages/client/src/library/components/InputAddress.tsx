import React, { InputHTMLAttributes } from 'react';
import { Web3Consumer } from 'contexts/Web3';
import { useAddressValidation } from 'hooks';
import { formatAddress, isAddr } from 'utils';
import Svg from 'library/Svg';

export type AddressValidationResult = {
  value: string;
  isValid: boolean;
};

export interface InputAddressProps {
  web3: any;
  value: string;
  isValid: boolean;
  onChange: (result: AddressValidationResult) => void;
}

const InputAddress: React.FC<InputAddressProps> = ({
  web3,
  value,
  isValid,
  onChange,
}) => {
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const onValueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let isValid = isAddr(value);
    if (isValid) {
      isValid = await isAddressValid(formatAddress(value));
    }
    // if address is valid, autoformat prefix with 0x
    onChange({ value: isValid ? formatAddress(value) : value, isValid });
  };

  return (
    <div className="is-flex">
      <div className="flex-1" style={{ position: 'relative' }}>
        <input
          className="border-light rounded-sm column is-full p-2 mt-2"
          type="text"
          value={value}
          onChange={onValueChange}
        />
        {isValid && (
          <div style={{ position: 'absolute', right: 17, top: 20 }}>
            <Svg name="Check" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3Consumer(InputAddress);
