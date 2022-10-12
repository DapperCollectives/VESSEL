import { useContext } from 'react';
import { Web3Context } from 'contexts/Web3';
import ButtonGroup from '../components/ButtonGroup';
import ModalHeader from '../components/ModalHeader';
import { useAccount } from 'hooks';
import { TRANSACTION_TYPE } from 'constants/enums';
import { TransferTokensContext } from '../TransferTokensContext';
import DepositTokenForm from './DepositTokenForm';
import SendTokenForm from './SendTokenForm';
import TransferTokenConfirmation from './TransferTokenConfirmation';

const Steps = () => {
  const [sendModalState] = useContext(TransferTokensContext);
  const { proposeTransfer } = useContext(Web3Context);
  const { doSendTokensToTreasury } = useAccount();

  const { currentStep, transactionType } = sendModalState;
  const isSendTransaction = transactionType === TRANSACTION_TYPE.SEND;

  const title = isSendTransaction ? 'Send' : 'Deposit';
  const sendOrDepositFn = isSendTransaction
    ? proposeTransfer
    : doSendTokensToTreasury;

  const renderTransferTokenForm = () => {
    if (isSendTransaction) {
      return <SendTokenForm />;
    }
    return <DepositTokenForm />;
  };

  return (
    <div className="has-text-black">
      <ModalHeader title={title} />
      {currentStep === 1 ? (
        <TransferTokenConfirmation />
      ) : (
        renderTransferTokenForm()
      )}
      <ButtonGroup proposeTransfer={sendOrDepositFn} />
    </div>
  );
};

export default Steps;
