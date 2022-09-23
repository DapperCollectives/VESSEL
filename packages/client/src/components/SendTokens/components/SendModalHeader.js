import React from "react";
import { useContext } from "react";
import { SendTokensContext } from "../sendTokensContext";
import Svg from "library/Svg";
import { useModalContext } from "contexts";

const SendModalHeader = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { closeModal } = useModalContext();
  const { currentStep } = sendModalState;
  const titleText = currentStep === 0 ? "Send" : "Review";
  return (
    <React.Fragment>
      <div className="p-5 border-light-bottom">
        <div className="is-flex has-text-black">
          <div className="flex-1 is-size-4">{titleText}</div>
          <div
            onClick={closeModal}
            style={{ width: 40 }}
            className="pointer is-flex is-align-items-center is-justify-content-end"
          >
            <Svg name="Close" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default SendModalHeader;
