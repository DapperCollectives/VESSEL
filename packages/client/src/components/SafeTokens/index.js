import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import VaultTable from "./VaultTable";
const SafeTokens = () => {
  const location = useLocation();
  const treasuryAddress = location.pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const balances = web3?.balances?.[treasuryAddress] ?? {};
  const vaults = Object.entries(balances).map(([coinType, balance]) => ({
    coinType,
    balance,
  }));
  return (
    <div>
      <div className="is-flex is-justify-content-space-between mt-5">
        <h2 className="flex-1">Tokens</h2>
        <div>
          <button className="button is-secondary is-small">
            Manage Token Vaults
          </button>
        </div>
      </div>
      {vaults.length > 0 && <VaultTable vaults={vaults} />}
    </div>
  );
};
export default SafeTokens;
