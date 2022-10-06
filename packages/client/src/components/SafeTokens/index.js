import { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useModalContext } from 'contexts';
import { Web3Context } from 'contexts/Web3';
import { SendTokens } from 'components';
import { EmptyTableWithCTA } from 'library/components';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import DepositTokens from 'modals/DepositTokens';
import VaultTable from './VaultTable';

const SafeTokens = () => {
  const location = useLocation();
  const history = useHistory();
  const web3 = useContext(Web3Context);
  const { openModal } = useModalContext();
  const treasuryAddress = location.pathname.split('/')[2];
  const balances = web3?.balances?.[treasuryAddress] ?? {};

  const vaults = Object.entries(balances).map(([coinType, balance]) => ({
    coinType,
    balance,
  }));

  const { addr: userAddress } = web3.user;
  const safeData = web3?.treasuries?.[treasuryAddress];

  const handleSendToken = (coinType) => {
    openModal(
      <SendTokens
        address={treasuryAddress}
        initialState={{
          assetType: ASSET_TYPES.TOKEN,
          coinType,
          transactionType: TRANSACTION_TYPE.SEND,
        }}
      />
    );
  };

  const handleDepositToken = (coinType) =>
    openModal(
      <DepositTokens
        address={userAddress}
        safeData={safeData}
        initialState={{
          assetType: ASSET_TYPES.TOKEN,
          coinType,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          recipient: treasuryAddress,
          recipientValid: true,
        }}
      />
    );

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
              type="button"
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
          header="This safe doesn't have any tokens"
          buttonText="Manage Token Vaults"
          onButtonClick={handleManageTokenVaults}
        />
      )}
      {vaults.length > 0 && (
        <VaultTable
          vaults={vaults}
          handleSendToken={handleSendToken}
          handleDepositToken={handleDepositToken}
        />
      )}
    </div>
  );
};
export default SafeTokens;
