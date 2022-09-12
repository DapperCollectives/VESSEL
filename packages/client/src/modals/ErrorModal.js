import React from "react";
import { Warning } from "../components/Svg";

const ErrorModal = ({ error, onClose }) => {
  return (
    <div className="p-5 has-text-black has-text-left">
      <div className="pl-5 columns is-vcentered is-multiline is-mobile border-light-bottom">
        <Warning />
        <h3 className="is-size-4 column is-half">Error</h3>
      </div>
      <div className="p-4 mt-5">
        <span className="mr-2 mt-2  has-text-grey">{error}</span>
      </div>
      <div className="is-flex is-align-items-center mt-5">
        <button className="button is-border mr-2 flex-1" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
