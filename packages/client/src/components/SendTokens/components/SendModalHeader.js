import { useContext } from "react";
import Svg from "library/Svg";
import { useModalContext } from "contexts";
import { SendTokensContext } from "../sendTokensContext";

const SendModalHeader = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { closeModal } = useModalContext();
  const { currentStep } = sendModalState;
  const titleText = currentStep === 0 ? "Send" : "Review";
  return (
    <>
      <div className="p-5 border-light-bottom">
        <div className="is-flex has-text-black">
          <div className="flex-1 is-size-4">{titleText}</div>
          <button
            type="button"
            onClick={closeModal}
            style={{ width: 40 }}
            className="pointer border-none has-background-white"
          >
            <Svg name="Close" />
          </button>
        </div>
      </div>
    </>
  );
};
export default SendModalHeader;
