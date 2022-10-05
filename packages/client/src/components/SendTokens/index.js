import { SendTokensContextProvider } from "./sendTokensContext";
import Steps from "./steps";

const SendTokens = ({ address, initialState }) => (
  <SendTokensContextProvider address={address} initialState={initialState}>
    <Steps />
  </SendTokensContextProvider>
);
export default SendTokens;
