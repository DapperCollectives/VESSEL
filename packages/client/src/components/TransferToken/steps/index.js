import { useContext } from 'react';
import ButtonGroup from '../components/ButtonGroup';
import ModalHeader from '../components/ModalHeader';
import { TRANSACTION_TYPE } from 'constants/enums';
import { TransferTokensContext } from '../TransferTokensContext';
import DepositTokenForm from './DepositTokenForm';
import SendTokenForm from './SendTokenForm';
import TransferTokenConfirmation from './TransferTokenConfirmation';

const Steps = () => {
  const [sendModalState] = useContext(TransferTokensContext);
  const { currentStep, transactionType } = sendModalState;

  const renderTokenForm = () => {
    if (transactionType === TRANSACTION_TYPE.SEND) {
      return <SendTokenForm />;
    }
    return <DepositTokenForm />;
  };

  return (
    <div className="has-text-black">
      <ModalHeader
        title={`${
          transactionType === TRANSACTION_TYPE.SEND ? 'Send' : 'Deposit'
        }`}
      />
      {currentStep === 1 ? <TransferTokenConfirmation /> : renderTokenForm()}
      <ButtonGroup />
    </div>
  );
};

export default Steps;
