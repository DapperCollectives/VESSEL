import { useContext, useEffect } from 'react';
import { TransferTokensContext } from '../../../contexts/TransferTokens';
import { Web3Context } from 'contexts/Web3';
import AddressDropdown from '../components/AddressDropdown';
import AmountInput from '../components/AmountInput';
import AssetSelector from '../components/AssetSelector';
import { ASSET_TYPES } from 'constants/enums';

const SendTokenForm = () => {
  const [sendModalState, setSendModalState] = useContext(TransferTokensContext);
  const { assetType, sender } = sendModalState;

  const web3 = useContext(Web3Context);

  const { balances } = web3;

  useEffect(() => {
    const coinBalances = balances?.[sender];
    setSendModalState((prevState) => ({
      ...prevState,
      coinBalances,
    }));
  }, []);

  return (
    <>
      <AssetSelector />
      {assetType === ASSET_TYPES.TOKEN && <AmountInput />}
      <AddressDropdown />
    </>
  );
};
export default SendTokenForm;
