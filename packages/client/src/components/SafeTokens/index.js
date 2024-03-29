import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useModalContext } from 'contexts';
import { Web3Context } from 'contexts/Web3';
import TransferTokens from 'components/TransferToken';
import { EmptyTableWithCTA } from 'library/components';
import { useAccount } from 'hooks';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { formatAddress } from 'utils';
import VaultTable from './VaultTable';

const SafeTokens = () => {
  const location = useLocation();
  const history = useHistory();
  const web3 = useContext(Web3Context);
  const { openModal } = useModalContext();
  const { getUserVaults } = useAccount();
  const treasuryAddress = location.pathname.split('/')[2];
  const balances = web3?.balances?.[treasuryAddress] ?? {};
  const [depositableCoinTypes, setDepositableCoinTypes] = useState([]);

  const vaults = Object.entries(balances).map(([coinType, balance]) => ({
    coinType,
    balance,
  }));

  const { addr: userAddress } = web3.user;

  const updateUserVaults = async () => {
    try {
      const userVaults = await getUserVaults(formatAddress(userAddress));

      setDepositableCoinTypes(userVaults);
    } catch (err) {
      console.log(`Failed to get user vaults, error: ${err}`);
    }
  };
  useEffect(() => {
    updateUserVaults();
  }, []);

  const handleSendToken = (coinType) => {
    openModal(
      <TransferTokens
        sender={treasuryAddress}
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
      <TransferTokens
        sender={userAddress}
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
          depositableCoinTypes={depositableCoinTypes}
          handleSendToken={handleSendToken}
          handleDepositToken={handleDepositToken}
        />
      )}
    </div>
  );
};
export default SafeTokens;
