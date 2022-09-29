import { useContext } from "react";
import { Dropdown } from "library/components";
import { COIN_TYPE_TO_META } from "constants/maps";
import { Web3Context } from "contexts/Web3";
import Svg from "library/Svg";

const CoinTypeDropDown = ({ coinType, setCoinType, address }) => {
  const web3 = useContext(Web3Context);
  const { balances } = web3;
  const balanceMap = balances[address];
  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));
  const renderOption = (itemValue, displayText) => (
    <div className="is-flex is-flex-grow-1 is-align-items-center is-justify-content-space-between">
      <span className="is-flex is-align-items-center">
        <Svg name={itemValue} className="mr-2" />
        <span className="has-text-weight-bold has-text-black">
          {displayText}
        </span>
      </span>
      <span>
        <span className="has-text-black mr-1">
          {balanceMap[itemValue] ? Number(balanceMap[itemValue]).toFixed(2) : 0}
        </span>
        Qty
      </span>
    </div>
  );

  return (
    <div className="mb-5">
      <p className="has-text-grey">
        Token Vault
        <span className="has-text-red"> *</span>
      </p>
      <Dropdown
        selectedValue={coinType}
        options={coinTypes}
        setOption={setCoinType}
        renderOption={renderOption}
      />
    </div>
  );
};
export default CoinTypeDropDown;
