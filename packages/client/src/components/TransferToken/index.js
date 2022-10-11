import { TransferTokensContextProvider } from './TransferTokensContext';
import Steps from './steps';

const TransferTokens = ({ address, initialState }) => (
  <TransferTokensContextProvider address={address} initialState={initialState}>
    <Steps />
  </TransferTokensContextProvider>
);
export default TransferTokens;
