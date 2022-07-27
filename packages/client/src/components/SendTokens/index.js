import { useEffect } from "react";
import { SendTokensContextProvider } from "./sendTokensContext";
import Steps from "./steps";

const SendTokens = (props) => {
  return (
    <SendTokensContextProvider {...props}>
      <Steps />
    </SendTokensContextProvider>
  );
};
export default SendTokens;
