import { SendTokensContextProvider } from "./sendTokensContext";
import Steps from "./steps";

const SendToken = (props) => {
  return (
    <SendTokensContextProvider {...props}>
      <Steps />
    </SendTokensContextProvider>
  );
};
export default SendToken;
