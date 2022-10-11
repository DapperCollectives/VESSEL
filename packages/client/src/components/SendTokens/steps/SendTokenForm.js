import { useContext } from 'react';
import AddressDropdown from '../components/AddressDropdown';
import AmountInput from '../components/AmountInput';
import AssetSelector from '../components/AssetSelector';
import ButtonGroup from '../components/ButtonGroup';
import SendModalHeader from '../components/SendModalHeader';
import { ASSET_TYPES } from 'constants/enums';
import { SendTokensContext } from '../sendTokensContext';

const SendTokenForm = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { assetType } = sendModalState;
  return (
    <div>
      <SendModalHeader />
      <AssetSelector />
      {assetType === ASSET_TYPES.TOKEN && <AmountInput />}
      <AddressDropdown />
      <ButtonGroup />
    </div>
  );
};
export default SendTokenForm;
