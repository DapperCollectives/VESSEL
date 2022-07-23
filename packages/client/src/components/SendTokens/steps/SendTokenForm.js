import SendModalHeader from "../components/SendModalHeader";
import AmountInput from "../components/AmountInput";
import AddressInput from "../components/AddressInput";
import AssetSelector from "../components/AssetSelector";
import CoinSelector from "../components/CoinSelector";
import ButtonGroup from "../components/ButtonGroup";

const SendTokenForm = () => {
  return (
    <div className="p-5 has-text-black">
      <SendModalHeader />
      <AmountInput />
      <AddressInput />
      <AssetSelector />
      <CoinSelector />
      <ButtonGroup />
    </div>
  );
};
export default SendTokenForm;
