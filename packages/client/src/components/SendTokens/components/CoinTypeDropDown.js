import { useContext } from "react";
import { Dropdown } from "library/components";
import { COIN_TYPE_TO_META } from "constants/maps";
import { Web3Context } from "contexts/Web3";
const CoinTypeDropDown = ({ coinType, setCoinType, address }) => {
  const web3 = useContext(Web3Context);
  const { balances } = web3;
  const balanceMap = balances[address];
  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));
  return (
    <div className="mb-5">
      <label className="has-text-grey">
        Token Vault<span className="has-text-red"> *</span>
      </label>
      <Dropdown
        value={coinType}
        values={coinTypes}
        setValue={setCoinType}
        style={{ height: "45px" }}
        renderItemAddOn={(itemValue) => {
          return (
            <span>
              <span className="has-text-black mr-1">
                {Number(balanceMap[itemValue]).toFixed(2)}
              </span>
              Qty
            </span>
          );
        }}
      />
    </div>
  );
};
export default CoinTypeDropDown;
