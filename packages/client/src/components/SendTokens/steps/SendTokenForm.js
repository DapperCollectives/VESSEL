import { useContext } from "react";
import { SendTokensContext } from "../sendTokensContext";
import { ASSET_TYPES } from "constants/enums";
import SendModalHeader from "../components/SendModalHeader";
import AmountInput from "../components/AmountInput";
import AddressInput from "../components/AddressInput";
import AssetSelector from "../components/AssetSelector";
import ButtonGroup from "../components/ButtonGroup";

const SendTokenForm = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { assetType } = sendModalState;
  return (
    <div className="p-5 has-text-black">
      <SendModalHeader />
      {assetType === ASSET_TYPES.TOKEN && <AmountInput />}
      <AddressInput />
      <AssetSelector />
      <ButtonGroup />
    </div>
  );
};
export default SendTokenForm;
