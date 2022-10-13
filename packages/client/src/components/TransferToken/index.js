import { TransferTokensContextProvider } from './TransferTokensContext';
import Steps from './steps';

const TransferTokens = ({ sender, initialState }) => (
  <TransferTokensContextProvider sender={sender} initialState={initialState}>
    <Steps />
  </TransferTokensContextProvider>
);
export default TransferTokens;
