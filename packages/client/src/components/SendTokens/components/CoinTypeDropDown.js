import { useContext, useEffect, useState } from "react";
import Dropdown from "components/Dropdown";
import { COIN_TYPE_TO_META } from "constants/maps";
import { Web3Context } from "contexts/Web3";
const CoinTypeDropDown = ({ coinType, setCoinType, address }) => {
  const web3 = useContext(Web3Context);
  const { getVaultBalance } = web3;
  const [balanceMap, setBalanceMap] = useState({});
  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));
  useEffect(() => {
    const fetchBalances = () => {
      coinTypes.forEach(async (type) => {
        const typeId = type.itemValue;
        const balance = await getVaultBalance(address, typeId);
        setBalanceMap((prevState) => ({
          ...prevState,
          [type.itemValue]: Number(balance).toFixed(2),
        }));
      });
    };
    fetchBalances();
    return () => {
      setBalanceMap({});
    };
  }, []);

  return (
    <Dropdown
      value={coinType}
      values={coinTypes}
      setValue={setCoinType}
      style={{ height: "45px" }}
      renderItemAddOn={(itemValue) => {
        return (
          <span>
            <span className="has-text-black mr-1">{balanceMap[itemValue]}</span>
            Qty
          </span>
        );
      }}
    />
  );
};
export default CoinTypeDropDown;
