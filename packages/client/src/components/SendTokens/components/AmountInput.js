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
    <div>
      <label className="has-text-grey">
        Amount<span className="has-text-red"> *</span>
      </label>
      <div className="is-flex is-justify-content-space-between">
        <input
          type="number"
          className="is-size-2 border-none p-0 mb-4"
          value={tokenAmount}
          style={{ maxWidth: "70%" }}
          onChange={(e) =>
            setSendModalState((prevState) => ({
              ...prevState,
              tokenAmount: e.target.value,
            }))
          }
        />

        <div>
          <button
            className="button is-primary flex-1 mt-2"
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
