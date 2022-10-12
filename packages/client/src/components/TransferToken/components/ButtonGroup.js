import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useModalContext } from 'contexts';
import { Web3Context } from 'contexts/Web3';
import { useErrorMessage } from 'hooks';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { formatAddress } from 'utils';
import { isEmpty } from 'lodash';
import { TransferTokensContext } from '../TransferTokensContext';

const ButtonGroup = ({ proposeTransfer }) => {
  const modalContext = useModalContext();
  const { proposeNFTTransfer, refreshTreasury } = useContext(Web3Context);
  const [sendModalState, setSendModalState] = useContext(TransferTokensContext);
  const history = useHistory();
  const { showErrorModal } = useErrorMessage();

  const {
    address,
    currentStep,
    assetType,
    tokenAmount,
    recipient,
    recipientValid,
    selectedNFT,
    coinType,
    transactionType,
  } = sendModalState;

  const safeAddress =
    transactionType === TRANSACTION_TYPE.SEND ? address : recipient;

  const continueReady =
    recipientValid &&
    (assetType === ASSET_TYPES.TOKEN ? tokenAmount > 0 : !isEmpty(selectedNFT));
  const btnText = currentStep === 1 && continueReady ? 'Sign & Deploy' : 'Next';
  const btnClasses = [
    'button is-primary flex-1',
    continueReady ? '' : 'disabled',
  ];
  const { collectionName, tokenId } = selectedNFT;

  const onSubmit = async () => {
    if (currentStep === 0) {
      setSendModalState((prevState) => ({
        ...prevState,
        currentStep: 1,
      }));
    }
    if (currentStep === 1) {
      try {
        if (assetType === ASSET_TYPES.TOKEN) {
          await proposeTransfer(
            formatAddress(recipient),
            tokenAmount,
            coinType
          );
        } else {
          await proposeNFTTransfer(
            formatAddress(address),
            formatAddress(recipient),
            `${collectionName}-${tokenId}`
          );
        }
        await refreshTreasury();
        modalContext.closeModal();
        history.push(`/safe/${safeAddress}`);
      } catch (error) {
        showErrorModal(error);
      }
    }
  };
  return (
    <div className="is-flex is-align-items-center mt-5 p-5 border-light-top">
      <button
        type="button"
        className="button is-border flex-1 mr-2"
        onClick={() => modalContext.closeModal()}
      >
        Cancel
      </button>
      <button
        type="button"
        className={btnClasses.join(' ')}
        onClick={onSubmit}
        disabled={!continueReady}
      >
        {btnText}
      </button>
    </div>
  );
};

export default ButtonGroup;
