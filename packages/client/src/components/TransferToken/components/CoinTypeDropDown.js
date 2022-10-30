import { Dropdown, Tooltip } from 'library/components';
import Svg from 'library/Svg';

const CoinTypeDropDown = ({ coinType, setCoinType, balances, tooltipText }) => {
  const coinTypes = Object.entries(balances).map(([key]) => ({
    itemValue: key,
    displayText: key,
    attr: {
      balance: balances[key] ? Number(balances[key]).toFixed(2) : 0,
    },
  }));
  const renderOption = ({ itemValue, displayText, attr }) => (
    <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
      <span className="is-flex is-align-items-center">
        <Svg name={itemValue} className="mr-2" />
        <span className="has-text-weight-bold has-text-black">
          {displayText}
        </span>
      </span>
      <span>
        <span className="has-text-black mr-1">{attr.balance}</span>
        Qty
      </span>
    </div>
  );

  return (
    <div className="mb-5">
      <p className="has-text-grey is-flex is-align-items-center">
        Token Vault
        <span className="has-text-red mr-1"> *</span>
        {tooltipText && (
          <Tooltip position="top" text={tooltipText} className="mt-2">
            <Svg name="QuestionMark" />
          </Tooltip>
        )}
      </p>
      <Dropdown
        selectedValue={coinType}
        options={coinTypes}
        setOption={setCoinType}
        renderOption={renderOption}
        defaultText="Select Token"
      />
    </div>
  );
};
export default CoinTypeDropDown;
