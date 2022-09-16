import { useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Web3Context } from "contexts/Web3";
import { useModalContext } from "contexts";
import { SendTokens } from "components";
import { EmptyTableWithCTA } from "library/components";
import VaultTable from "./VaultTable";
import { ASSET_TYPES } from "constants/enums";
const SafeTokens = () => {
  const location = useLocation();
  const history = useHistory();
  const { openModal } = useModalContext();
  const treasuryAddress = location.pathname.split("/")[2];
  const web3 = useContext(Web3Context);
  const balances = web3?.balances?.[treasuryAddress] ?? {};
  const vaults = Object.entries(balances).map(([coinType, balance]) => ({
    coinType,
    balance,
  }));
  const handleSendToken = (coinType) => {
    openModal(
      <SendTokens
        address={treasuryAddress}
        initialState={{
          assetType: ASSET_TYPES.TOKEN,
          coinType,
        }}
      />
    );
  };
  const handleManageTokenVaults = () => {
    history.push(`/safe/${treasuryAddress}/settings#tokenAsset`);
  };
  return (
    <div>
      <div className="is-flex is-justify-content-space-between mt-5">
        <h2 className="flex-1">Tokens</h2>
        <div>
          {vaults.length > 0 && (
            <button
              className="button is-secondary is-small"
              onClick={handleManageTokenVaults}
            >
              Manage Token Vaults
            </button>
          )}
        </div>
      </div>
      {vaults.length === 0 && (
        <EmptyTableWithCTA
          message="This safe doesn't have any tokens"
          buttonText="Manage Token Vaults"
          onButtonClick={handleManageTokenVaults}
        />
      )}
      {vaults.length > 0 && (
        <VaultTable vaults={vaults} handleSendToken={handleSendToken} />
      )}
    </div>
  );
};
export default SafeTokens;
