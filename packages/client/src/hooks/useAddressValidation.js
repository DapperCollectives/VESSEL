import { isAddr } from '../utils';

export default function useAddressValidation(provider) {
  const isAddressValid = async (address) => {
    const isAddressString = isAddr(address);

    if (!isAddressString) {
      return false;
    }

    try {
      await provider.account(address);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    isAddressValid,
  };
}
