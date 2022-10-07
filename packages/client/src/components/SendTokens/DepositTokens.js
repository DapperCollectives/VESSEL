import { SendTokensContextProvider } from 'components/SendTokens/sendTokensContext';
import Steps from 'components/SendTokens/steps';

const DepositTokens = ({ address, safeData, initialState }) => (
  <SendTokensContextProvider address={address} initialState={initialState}>
    <Steps safeData={safeData} userAddress={address} />
  </SendTokensContextProvider>
);

export default DepositTokens;
