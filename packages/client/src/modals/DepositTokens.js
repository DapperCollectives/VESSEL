import AmountInput from "components/SendTokens/components/AmountInput";
import AssetSelector from "components/SendTokens/components/AssetSelector";
import ButtonGroup from "components/SendTokens/components/ButtonGroup";
import {
  SendTokensContext,
  SendTokensContextProvider,
} from "components/SendTokens/sendTokensContext";
import { ASSET_TYPES } from "constants/enums";
import { useContext } from "react";

const DepositTokenForm = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { assetType } = sendModalState;
  return (
    <div className="px-5 has-text-black">
      <AssetSelector />
      {assetType === ASSET_TYPES.TOKEN && <AmountInput />}

      <ButtonGroup />
    </div>
  );
};

const Steps = () => {
  // const [sendModalState] = useContext(SendTokensContext);
  //const { currentStep } = sendModalState;
  // if (currentStep === 1) {
  //   return <DepositTokenConfirmation />;
  // }
  return <DepositTokenForm />;
};

const DepositTokens = ({ address, initialState }) => (
  <SendTokensContextProvider address={address} initialState={initialState}>
    <Steps />
  </SendTokensContextProvider>
);

export default DepositTokens;
