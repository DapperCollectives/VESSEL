import { useContext, useEffect, useState } from 'react';
import { Web3Context } from 'contexts/Web3';
import AmountInput from 'components/SendTokens/components/AmountInput';
import AssetSelector from 'components/SendTokens/components/AssetSelector';
import ButtonGroup from 'components/SendTokens/components/ButtonGroup';
import ModalHeader from 'components/SendTokens/components/ModalHeader';
import TransactionDetails from 'components/SendTokens/components/TransactionDetails';
import {
  SendTokensContext,
  SendTokensContextProvider,
} from 'components/SendTokens/sendTokensContext';
import { useAccount, useContacts } from 'hooks';
import { ASSET_TYPES } from 'constants/enums';
import { formatAddress, getNameByAddress, isVaultInTreasury } from 'utils';
import Svg from 'library/Svg';

const DepositTokenConfirmation = () => (
  <>
    <TransactionDetails />
    <p className="mt-2 px-5 has-text-grey">
      To complete this action, you will have to confirm it with your connected
      wallet on the next step.
    </p>
  </>
);

const DepositTokenForm = ({ safeData, userAddress }) => {
  const [sendModalState] = useContext(SendTokensContext);
  const { assetType } = sendModalState;
  const { address: safeAddress, name: safeName } = safeData;
  const { contacts } = useContacts(safeAddress);
  const web3 = useContext(Web3Context);
  const { getUserBalances } = useAccount();
  const [coinBalances, setCoinBalances] = useState();

  const { vaults } = web3;

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

      setCoinBalances(balances);
    } catch (err) {
      console.log(`Failed to get coin balances, error: ${err}`);
    }
  };
  useEffect(() => {
    updateUserBalance();
  }, []);

  return (
    <>
      <AssetSelector coinBalances={coinBalances} />
      {assetType === ASSET_TYPES.TOKEN && (
        <AmountInput coinBalances={coinBalances} />
      )}
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

const Steps = ({ safeData, userAddress }) => {
  const [sendModalState] = useContext(SendTokensContext);
  const { currentStep } = sendModalState;

  return (
    <div className="has-text-black">
      <ModalHeader title="Deposit" />
      {currentStep === 1 ? (
        <DepositTokenConfirmation />
      ) : (
        <DepositTokenForm safeData={safeData} userAddress={userAddress} />
      )}
      <ButtonGroup />
    </div>
  );
};

const DepositTokens = ({ address, safeData, initialState }) => (
  <SendTokensContextProvider address={address} initialState={initialState}>
    <Steps safeData={safeData} userAddress={address} />
  </SendTokensContextProvider>
);

export default DepositTokens;
