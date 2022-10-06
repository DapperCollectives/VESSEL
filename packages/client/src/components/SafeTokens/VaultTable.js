import Svg from 'library/Svg';

const VaultTable = ({ vaults, handleSendToken, handleDepositToken }) => {
  return (
    <div className="p-0 mt-4 is-flex is-flex-direction-column rounded-sm border-light has-shadow">
      <div className="is-flex is-justify-content-space-between p-5 border-light-bottom">
        <div className="flex-2">
          <span className="has-text-grey">Type</span>
        </div>
        <div className="flex-2">
          <span className="has-text-grey">Amount</span>
        </div>
        <div className="flex-1">
          <span className="has-text-grey">Actions</span>
        </div>
      </div>
      {vaults.map(({ coinType, balance }) => (
        <div
          key={coinType}
          className="is-flex is-justify-content-space-between p-5  border-light-bottom"
        >
          <div className="flex-2 is-flex align-items-center">
            <Svg name={coinType}></Svg>
            <span className="ml-2 mt-1">{coinType}</span>
          </div>
          <div className="flex-2">
            <span>{Number(balance).toLocaleString()}</span>
          </div>
          <div className="flex-1">
            <button
              className="button is-transparent pl-0"
              onClick={() => handleDepositToken(coinType)}
            >
              Deposit
            </button>
            <button
              className="button is-transparent pl-0"
              onClick={() => handleSendToken(coinType)}
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default VaultTable;
