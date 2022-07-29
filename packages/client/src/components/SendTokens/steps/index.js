import { useContext } from "react";
import { SendTokensContext } from "../sendTokensContext";
import SendTokenForm from "./SendTokenForm";
import SendTokenConfirmation from "./SendTokenConfirmation";
const Steps = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep } = sendModalState;
  if (currentStep === 1) {
    return <SendTokenConfirmation />;
  }
  return <SendTokenForm />;
};

export default Steps;
