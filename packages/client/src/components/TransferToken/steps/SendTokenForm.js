import { useContext } from 'react';
import { Web3Context } from 'contexts/Web3';
import AddressDropdown from '../components/AddressDropdown';
import AmountInput from '../components/AmountInput';
import AssetSelector from '../components/AssetSelector';
import { ASSET_TYPES } from 'constants/enums';
import { TransferTokensContext } from '../TransferTokensContext';

const SendTokenForm = () => {
  const [sendModalState] = useContext(TransferTokensContext);
  const { assetType, address } = sendModalState;

  const web3 = useContext(Web3Context);

  const { balances } = web3;
  const coinBalances = balances?.[address];

  return (
    <>
      <AssetSelector coinBalances={coinBalances} />
      {assetType === ASSET_TYPES.TOKEN && (
        <AmountInput coinBalances={coinBalances} />
      )}
      <AddressDropdown />
    </>
  );
};
export default SendTokenForm;
