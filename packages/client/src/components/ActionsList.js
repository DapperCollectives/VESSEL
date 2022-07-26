import React from "react";
import { formatActionString } from "../utils";

function ActionsList({ actions = [], onSign, onConfirm, safeData }) {
  const ActionComponents = [];
  if (!actions.length) {
    ActionComponents.push(
      <div
        className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
        style={{ minHeight: 175 }}
        key="no-transactions"
      >
        No pending transactions
      </div>
    );
  } else {
    actions.forEach((action, idx) => {
      const borderClass = idx < actions.length - 1 ? "border-light-top" : ``;
      const totalSigs = Object.keys(action.verifiedSigners).length;
      const totalSigned = Object.values(action.verifiedSigners).filter(
        (x) => x
      ).length;
      const confirmReady = totalSigned >= safeData.threshold;
      const background = confirmReady ? "#FF8A00" : "#FF0000";
      const actionPrompt = confirmReady
        ? "Confirm Transaction"
        : "Signature Required";
      const actionCopy = confirmReady ? "Confirm" : "Sign";
      const actionFn = confirmReady ? onConfirm : onSign;
      ActionComponents.push(
        <div
          key={action.uuid}
          className={`p-5 ${borderClass} is-flex column is-full`}
        >
          <div className="pr-5">{action.uuid}</div>
          <div className="flex-1">{formatActionString(action.intent)}</div>
          <div className="pl-6" style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                left: 25,
                top: 4,
                background,
              }}
            />
            {actionPrompt}
          </div>
          <div className="pl-6" style={{ position: "relative" }}>
            {totalSigned} of {safeData.threshold} signatures
          </div>
          <div
            className="pl-6 is-underlined pointer"
            onClick={() => actionFn(action)}
          >
            {actionCopy}
          </div>
        </div>
      );
    });
  }

  return (
    <div className="column p-0 mt-4 mb-5 is-flex is-full border-light has-shadow rounded-sm is-flex-wrap-wrap">
      {ActionComponents}
    </div>
  );
}

export default ActionsList;
