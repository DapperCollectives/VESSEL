import { useContext } from 'react';
import { SendTokensContext } from '../sendTokensContext';
import SendTokenConfirmation from './SendTokenConfirmation';
import SendTokenForm from './SendTokenForm';

const Steps = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep } = sendModalState;
  if (currentStep === 1) {
    return <SendTokenConfirmation />;
  }
  return <SendTokenForm />;
};

export default Steps;
