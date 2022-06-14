import React from "react";
import ProgressBar from "./ProgressBar";
import { Person, Minus, Plus } from "./Svg";
import { getProgressPercentageForSignersAmount } from "../utils";

function SignatureRequirements({
  safeOwners,
  signersAmount,
  setSignersAmount,
}) {
  const signerClasses = [
    "is-flex",
    "is-justify-content-center",
    "is-align-items-center",
  ];

  const minusSignerClasses = [
    ...signerClasses,
    "border-light-right",
    signersAmount > 1 ? "pointer" : "is-disabled",
  ];

  const plusSignerClasses = [
    ...signerClasses,
    signersAmount < safeOwners.length ? "pointer" : "is-disabled",
  ];

  const onMinusSigner = () => {
    if (signersAmount - 1 > 0) {
      setSignersAmount(signersAmount - 1);
    }
  };

  const onPlusSigner = () => {
    if (signersAmount + 1 <= safeOwners.length) {
      setSignersAmount(signersAmount + 1);
    }
  };

  const progress = getProgressPercentageForSignersAmount(signersAmount);

  return (
    <>
      <div className="column mt-5 is-flex is-full">
        <h4 className="is-size-5">Signature Requirements</h4>
      </div>
      <div className="column is-flex is-full">
        <div className="flex-1 is-flex is-flex-direction-column pr-5">
          <label className="has-text-grey mb-2">
            Set the number of signatures required to confirm a transaction
          </label>
          <div className="is-flex border-light rounded-sm">
            <div className="px-5 border-light-right">
              <Person />
            </div>
            <div className="flex-1 is-flex is-align-items-center px-5 border-light-right">
              {signersAmount} of {Math.max(safeOwners.length, 1)} owner(s)
            </div>
            <div
              className={minusSignerClasses.join(" ")}
              style={{ width: 48 }}
              onClick={onMinusSigner}
            >
              <Minus />
            </div>
            <div
              className={plusSignerClasses.join(" ")}
              style={{ width: 48 }}
              onClick={onPlusSigner}
            >
              <Plus />
            </div>
          </div>
        </div>
        <div className="flex-1 is-flex is-flex-direction-column">
          <div className="is-flex is-justify-content-space-between mb-2">
            <label className="has-text-grey">Security Strength</label>
            <label className="has-text-grey">{progress}%</label>
          </div>
          <div className="is-flex flex-1">
            <div className="is-flex column is-full border-light rounded-sm">
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignatureRequirements;
