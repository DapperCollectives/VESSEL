import React from "react";
import { useContext } from "react";
import { SendTokensContext } from "../sendTokensContext";
import { shortenAddr } from "../../../utils";

const SendModalHeader = () => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep, address } = sendModalState;
  const titleText = currentStep === 0 ? "Send" : "Review";
  return (
    <React.Fragment>
      <h2 className="is-size-4">{titleText}</h2>
      <div className="border-light-bottom mb-4 pb-5">
        <span className="border-light-right mr-2 pr-2 has-text-grey">
          Step {currentStep + 1} of 2
        </span>
        <span className="is-underlined">{shortenAddr(address)}</span>
      </div>
    </React.Fragment>
  );
};
export default SendModalHeader;
