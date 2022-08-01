import { useContext, useState } from "react";
import { Web3Context } from "contexts/Web3";
import { SendTokensContext } from "../sendTokensContext";
const AmountInput = () => {
  const [sendModalState, setSendModalState] = useContext(SendTokensContext);
  const web3 = useContext(Web3Context);
  const { getVaultBalance } = web3;
  const { tokenAmount, coinType, address } = sendModalState;
  const handleMaxButtonClick = async () => {
    const balance = await getVaultBalance(address, coinType);
    setSendModalState((prevState) => ({
      ...prevState,
      tokenAmount: balance,
    }));
  };
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

        <div style={{ position: "absolute", top: "5px", right: "0px" }}>
          <button
            className="button mr-1 border-light p-2"
            onClick={handleMaxButtonClick}
          >
            Max
          </button>
        </div>
      </div>
    </div>
  );
};
export default AmountInput;
