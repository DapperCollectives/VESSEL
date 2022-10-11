import { useContext } from 'react';
import { TransferTokensContext } from '../TransferTokensContext';

const AmountInput = ({ coinBalances }) => {
  const [sendModalState, setSendModalState] = useContext(TransferTokensContext);
  const { tokenAmount, coinType } = sendModalState;
  const handleMaxButtonClick = async () => {
    const balance = coinBalances?.[coinType] ?? 0;
    setSendModalState((prevState) => ({
      ...prevState,
      tokenAmount: balance,
    }));
  };
  return (
    <div className="my-2 px-5">
      <p className="has-text-grey">
        Amount
        <span className="has-text-red"> *</span>
      </p>
      <div className="is-flex" style={{ position: 'relative' }}>
        <input
          type="number"
          className="flex-1 is-size-4 border-light rounded-sm p-3 mb-4 has-text-heighlight"
          value={tokenAmount}
          onChange={(e) =>
            setSendModalState((prevState) => ({
              ...prevState,
              tokenAmount: e.target.value,
            }))
          }
        />

        <div style={{ position: 'absolute', top: '6px', right: '16px' }}>
          <button
            type="button"
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
