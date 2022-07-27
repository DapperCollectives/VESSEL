import { useContext, useState } from "react";
import { SendTokensContext } from "../sendTokensContext";
const AmountInput = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const { tokenAmount } = sendModalState;
  return (
    <div>
      <label className="has-text-grey">
        Amount<span className="has-text-red"> *</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          className="is-size-2 border-none column is-full p-0 mb-4"
          value={tokenAmount}
          onChange={(e) =>
            setSendModalState((prevState) => ({
              ...prevState,
              tokenAmount: e.target.value,
            }))
          }
        />

        {/* <div style={{ position: "absolute", top: "20px", right: "0px" }}>
          <button className="button mr-1 border-light p-2">Max</button>
          <button className="button mr-1 border-light p-2">exch</button>
        </div> */}
      </div>
    </div>
  );
};
export default AmountInput;
