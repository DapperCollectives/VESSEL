import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useModalContext } from 'contexts';
import { Web3Context } from 'contexts/Web3';
import { useAccount } from 'hooks';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { formatAddress } from 'utils';
import { isEmpty } from 'lodash';
import { SendTokensContext } from '../sendTokensContext';

const ButtonGroup = () => {
  const modalContext = useModalContext();
  const web3 = useContext(Web3Context);
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const history = useHistory();

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

  const { doSendTokensToTreasury } = useAccount();

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
      if (assetType === ASSET_TYPES.TOKEN) {
        if (transactionType === TRANSACTION_TYPE.SEND) {
          await web3.proposeTransfer(
            formatAddress(recipient),
            tokenAmount,
            coinType
          );
        } else {
          await doSendTokensToTreasury(
            formatAddress(recipient),
            parseFloat(tokenAmount).toFixed(8),
            coinType
          );
        }
      } else {
        await web3.proposeNFTTransfer(
          formatAddress(address),
          formatAddress(recipient),
          `${collectionName}-${tokenId}`
        );
      }
      await web3.refreshTreasury();
      modalContext.closeModal();
      history.push(
        `/safe/${
          transactionType === TRANSACTION_TYPE.SEND ? address : recipient
        }`
      );
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
