import { useContext, useEffect } from 'react';
import { TransferTokensContext } from 'contexts/TransferTokens';
import { Web3Context } from 'contexts/Web3';
import AmountInput from 'components/TransferToken/components/AmountInput';
import AssetSelector from 'components/TransferToken/components/AssetSelector';
import { useAccount, useContacts } from 'hooks';
import { ASSET_TYPES } from 'constants/enums';
import { formatAddress, getNameByAddress, isVaultInTreasury } from 'utils';
import Svg from 'library/Svg';
import { isEmpty } from 'lodash';

const DepositTokenForm = () => {
  const { getUserBalances } = useAccount();

  const [sendModalState, setSendModalState] = useContext(TransferTokensContext);
  const {
    assetType,
    sender: userAddress,
    recipient: safeAddress,
  } = sendModalState;

  const web3 = useContext(Web3Context);
  const { name: safeName } = web3?.treasuries?.[safeAddress];
  const { getTreasuryVaults, vaults } = web3;
  const { contacts } = useContacts(safeAddress);

  const getVaults = async () => {
    await getTreasuryVaults(safeAddress);
  };

  const updateUserBalance = async () => {
    try {
      const userBalances = await getUserBalances(formatAddress(userAddress));
      const balances = {};
      userBalances.forEach((userBalance) => {
        const { coinType, balance } = userBalance;
        if (isVaultInTreasury(vaults[safeAddress], coinType)) {
          balances[userBalance.coinType] = balance;
        }
      });

      setSendModalState((prevState) => ({
        ...prevState,
        coinBalances: balances,
      }));
    } catch (err) {
      console.log(`Failed to get coin balances, error: ${err}`);
    }
  };

  useEffect(() => {
    if (!userAddress) {
      return;
    }
    if (isEmpty(vaults)) {
      getVaults();
    } else {
      updateUserBalance();
    }
  }, [userAddress, vaults]);

  return (
    <>
      <AssetSelector />
      {assetType === ASSET_TYPES.TOKEN && <AmountInput />}
      <div className="px-5 is-size-6 has-text-grey">
        <div className="m-1 columns border-light-bottom border-light-top">
          <span className="column pl-0">Deposit From</span>
          <div className="column pl-0">
            <span className="has-text-weight-bold has-text-black">
              {getNameByAddress(contacts, userAddress)}
            </span>
            <div>
              <span>{userAddress}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(userAddress)}
              >
                <Svg name="Copy" className="mt-1 ml-2" />
              </span>
            </div>
          </div>
        </div>
        <div className="m-1 columns border-light-bottom">
          <span className="column pl-0">Deposit To</span>
          <div className="column pl-0">
            <span className="has-text-weight-bold has-text-black">
              {safeName}
            </span>
            <div>
              <span>{safeAddress}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(safeAddress)}
              >
                <Svg name="Copy" className="mt-1 ml-2" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositTokenForm;
