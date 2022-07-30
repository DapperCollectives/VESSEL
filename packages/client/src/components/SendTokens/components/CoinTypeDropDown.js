import Dropdown from "components/Dropdown";
import { COIN_TYPE_TO_META } from "constants/maps";
const CoinTypeDropDown = ({ coinType, setCoinType }) => {
  const coinTypes = Object.entries(COIN_TYPE_TO_META).map((type) => ({
    itemValue: type[0],
    displayText: type[1].displayName,
  }));

  return (
    <Dropdown
      value={COIN_TYPE_TO_META[coinType].displayName}
      values={coinTypes}
      setValue={setCoinType}
      style={{ height: "45px" }}
    />
  );
};
export default CoinTypeDropDown;
