import { useContext } from 'react';
import ButtonGroup from '../components/ButtonGroup';
import ModalHeader from '../components/ModalHeader';
import { SendTokensContext } from '../sendTokensContext';
import SendTokenConfirmation from './SendTokenConfirmation';
import SendTokenForm from './SendTokenForm';

const Steps = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep } = sendModalState;

  return (
    <div className="has-text-black">
      <ModalHeader title="Send" />
      {currentStep === 1 ? <SendTokenConfirmation /> : <SendTokenForm />}
      <ButtonGroup />
    </div>
  );
};

export default Steps;
