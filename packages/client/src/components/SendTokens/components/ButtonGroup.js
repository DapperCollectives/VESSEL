import { useContext } from "react";
import { formatAddress } from "utils";
import { Web3Context } from "contexts/Web3";
import { useHistory } from "react-router-dom";
import { useModalContext } from "contexts";
import { ASSET_TYPES } from "constants/enums";
import { SendTokensContext } from "../sendTokensContext";

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
  } = sendModalState;

  const continueReady =
    recipientValid &&
    (assetType === ASSET_TYPES.TOKEN ? tokenAmount > 0 : selectedNFT);
  const btnText = currentStep === 1 && continueReady ? "Sign & Deploy" : "Next";
  const btnClasses = [
    "button is-primary flex-1",
    continueReady ? "" : "disabled",
  ];
  const onSubmit = async () => {
    if (currentStep === 0) {
      return setSendModalState((prevState) => ({
        ...prevState,
        currentStep: 1,
      }));
    }
    if (currentStep === 1) {
      if (assetType === ASSET_TYPES.TOKEN) {
        await web3.proposeTransfer(
          formatAddress(recipient),
          tokenAmount,
          coinType
        );
      } else {
        await web3.proposeNFTTransfer(
          formatAddress(address),
          formatAddress(recipient),
          selectedNFT
        );
      }
      await web3.refreshTreasury();
      modalContext.closeModal();
      history.push(`/safe/${address}`);
    }
  };
  return (
    <div className="is-flex is-align-items-center mt-6 px-5 pb-5">
      <button
        className="button is-border flex-1 mr-2"
        onClick={() => modalContext.closeModal()}
      >
        Cancel
      </button>
      <button
        className={btnClasses.join(" ")}
        onClick={onSubmit}
        disabled={!continueReady}
      >
        {btnText}
      </button>
    </div>
  );
};

export default ButtonGroup;
