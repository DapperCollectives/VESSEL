import { useContext } from 'react';
import ButtonGroup from '../components/ButtonGroup';
import ModalHeader from '../components/ModalHeader';
import { TRANSACTION_TYPE } from 'constants/enums';
import { SendTokensContext } from '../sendTokensContext';
import DepositTokenForm from './DepositTokenForm';
import SendTokenConfirmation from './SendTokenConfirmation';
import SendTokenForm from './SendTokenForm';

const Steps = ({ safeData, userAddress }) => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep, transactionType } = sendModalState;

  const renderTokenForm = () => {
    if (transactionType === TRANSACTION_TYPE.SEND) {
      return <SendTokenForm />;
    }
    return <DepositTokenForm safeData={safeData} userAddress={userAddress} />;
  };

  return (
    <div className="has-text-black">
      <ModalHeader
        title={`${
          transactionType === TRANSACTION_TYPE.SEND ? 'Send' : 'Deposit'
        }`}
      />
      {currentStep === 1 ? <SendTokenConfirmation /> : renderTokenForm()}
      <ButtonGroup />
    </div>
  );
};

export default Steps;
