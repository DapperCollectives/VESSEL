import { SendTokensContextProvider } from "./sendTokensContext";
import Steps from "./steps";

const SendTokens = (props) => (
  <SendTokensContextProvider {...props}>
    <Steps />
  </SendTokensContextProvider>
);
export default SendTokens;
