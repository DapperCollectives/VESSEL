import { useContext } from "react";
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
    <div className="my-2 px-5">
      <label className="has-text-grey">
        Amount<span className="has-text-red"> *</span>
      </label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          className="is-size-4 border-light rounded-sm p-3 mb-4 has-text-heighlight"
          value={tokenAmount}
          onChange={(e) =>
            setSendModalState((prevState) => ({
              ...prevState,
              tokenAmount: e.target.value,
            }))
          }
        />

        <div style={{ position: "absolute", top: "6px", right: "16px" }}>
          <button
            className="button is-small is-primary flex-1 mt-2"
            onClick={handleMaxButtonClick}
          >
            <strong>MAX</strong>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AmountInput;
