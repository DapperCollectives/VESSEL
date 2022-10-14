import { TransferTokensProvider } from 'contexts';
import Steps from './steps';

const TransferTokens = ({ sender, initialState }) => (
  <TransferTokensProvider sender={sender} initialState={initialState}>
    <Steps />
  </TransferTokensProvider>
);
export default TransferTokens;
