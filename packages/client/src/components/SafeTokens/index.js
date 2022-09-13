import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
const SafeTokens = () => {
  const location = useLocation();
  const treasuryAddress = location.pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const vaults = web3?.balances?.[treasuryAddress];
  return (
    <div>
      <div className="is-flex mt-5">
        <h2>Tokens</h2>
      </div>
    </div>
  );
};
export default SafeTokens;
