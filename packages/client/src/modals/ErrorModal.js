import React, { useState } from "react";
import Svg from "library/Svg";
import { isString } from "lodash";

const ErrorModal = ({ error, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="has-text-black has-text-left">
      <div className="p-5 border-light-bottom">
        <div className="has-text-black m-1">
          Your transaction could not be completed.
          <br />
          Please try again later.
        </div>
        {isString(error) && (
          <div className="pt-2 has-text-yellow-dark">
            <span
              className="pointer is-flex"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ whiteSpace: "nowrap" }}
            >
              <Svg name={`${isExpanded ? "CaretDown" : "CaretRight"}`} />
              <span className="ml-2">Error Details</span>
            </span>
            <div
              className={`
                ${isExpanded ? "" : "is-hidden"}
                p-4 mt-3 has-background-yellow-tertiary border-yellow rounded-sm 
                `}
            >
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 is-flex">
        <button
          type="button"
          className="mr-2 button flex-1 is-border"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
