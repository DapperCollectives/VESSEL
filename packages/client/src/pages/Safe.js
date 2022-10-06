import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Web3Consumer, useModalContext } from 'contexts';
import { createSignature } from 'contexts/Web3';
import {
  SafeContacts,
  SafeHome,
  SafeNFTs,
  SafeSettings,
  SafeTokens,
  SafeTransactions,
  SendTokens,
  TestToolBox,
} from 'components';
import { EmptyTableWithCTA } from 'library/components';
import { useClipboard, useErrorMessage } from 'hooks';
import { ACTION_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { shortenString } from 'utils';
import Svg from 'library/Svg';
import { DepositTokens, TransactionSuccessModal } from 'modals';

function Safe({ web3 }) {
  const params = useParams();
  const { address, tab } = params;
  const { openModal, closeModal } = useModalContext();
  const clipboard = useClipboard();

  const { showErrorModal } = useErrorMessage();

  const safeData = web3?.treasuries?.[address];
  const actions = web3?.actions?.[address];
  const allBalance = web3?.balances?.[address];
  const allNFTs = web3?.NFTs?.[address];
  const userAddress = web3?.user?.addr;

  if (!safeData) {
    return (
      <section className="section screen-height is-flex is-align-items-center">
        <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          Couldn't find this safe's data...
        </div>
      </section>
    );
  }

  const showTransactionSuccessModal = (action, safeName, safeAddress) => {
    const actionData = action.data.actionView;
    if (
      actionData.type === ACTION_TYPES.TRANSFER_NFT ||
      actionData.type === ACTION_TYPES.TRANSFER_TOKEN
    ) {
      openModal(
        <TransactionSuccessModal
          safeName={safeName}
          safeAddress={safeAddress}
          actionData={actionData}
          txID={action.transactionId}
          onClose={closeModal}
        />,
        {
          headerTitle: 'Success',
        }
      );
    }
  };

  const currentTab = tab ?? 'home';
  const buttons = [
    'home',
    'transactions',
    'tokens',
    'NFTs',
    'contacts',
    'settings',
  ];
  const buttonClasses = ['button is-nav', 'is-capitalized', 'mr-2'];

  const ButtonCpts = buttons.map((btn, i) => {
    const classes = [...buttonClasses, currentTab === btn ? 'is-focused' : ''];
    const baseUrl = `/safe/${address}`;
    const to = btn === 'home' ? baseUrl : `${baseUrl}/${btn}`;
    return (
      <NavLink to={to} key={`btn-${btn}`}>
        <button type="button" className={classes.join(' ')} key={i}>
          {btn}
        </button>
      </NavLink>
    );
  });

  const { signerApprove, signerReject, executeAction } = web3;

  const onApproveAction = async ({ uuid, intent }) => {
    const { message, keyIds, signatures, height } = await createSignature(
      intent,
      uuid
    );

    await signerApprove(
      parseInt(uuid, 10),
      message,
      keyIds,
      signatures,
      height
    );
  };

  const onRejectAction = async ({ uuid, intent }) => {
    const { message, keyIds, signatures, height } = await createSignature(
      intent,
      uuid
    );

    await signerReject(parseInt(uuid, 10), message, keyIds, signatures, height);
  };

  const onExecuteAction = async ({ uuid }) => {
    const events = await executeAction(uuid).catch((error) =>
      showErrorModal(error)
    );
    if (events) {
      const action = events.find((e) => e.type.endsWith('ActionExecuted'));
      showTransactionSuccessModal(action, safeData.name, safeData.address);
    }
  };

  const tabMap = {
    home: (
      <SafeHome
        key="safe-home"
        safeData={safeData}
        allBalance={allBalance}
        allNFTs={allNFTs}
        actions={actions}
        address={address}
        userAddress={userAddress}
        onApprove={onApproveAction}
        onReject={onRejectAction}
        onExecute={onExecuteAction}
      />
    ),
    transactions: (
      <SafeTransactions
        key="safe-transactions"
        safeData={safeData}
        emptyComponent={
          <EmptyTableWithCTA
            header="You don't have any transactions history."
            message="Create a new transaction above."
          />
        }
        className="mt-4"
      />
    ),
    tokens: <SafeTokens key="safe-tokens" />,
    NFTs: (
      <SafeNFTs
        web3={web3}
        name={safeData.name}
        address={address}
        key="safe-assets"
      />
    ),
    contacts: <SafeContacts key="safe-contacts" address={address} />,
    settings: <SafeSettings key="safe-settings" />,
  };

  const BodyComponent = tabMap[currentTab];

  const onSend = () => {
    openModal(
      <SendTokens
        address={address}
        initialState={{
          transactionType: TRANSACTION_TYPE.SEND,
        }}
      />
    );
  };

  const onDeposit = () =>
    openModal(
      <DepositTokens
        address={userAddress}
        safeData={safeData}
        initialState={{
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          recipient: safeData.address,
          recipientValid: true,
        }}
      />
    );

  return (
    <section
      className="section is-flex is-flex-direction-column has-text-black"
      style={{
        maxWidth: 920 + 48, // based on figma design + padding
      }}
    >
      <div className="column is-full p-0 is-flex is-flex-direction-column mb-5">
        {process.env.REACT_APP_FLOW_ENV !== 'mainnet' && (
          <TestToolBox address={address} />
        )}
        <h1 className=" mb-2">{safeData.name}</h1>
        <p>
          <span className="has-text-grey">
            Safe address
            {shortenString(address)}
          </span>
          <span className="is-underlined ml-2 pointer">
            <button
              type="button"
              onClick={() => clipboard.copy(address)}
              className="border-none has-background-white"
            >
              {clipboard.textJustCopied === address ? 'Copied' : 'Copy address'}
            </button>
          </span>
        </p>
      </div>
      <div className="column is-full p-0 is-flex is-align-items-center">
        <div className="is-flex">{ButtonCpts}</div>
        <div className="is-flex flex-1 is-justify-content-end">
          <div className="w-auto">
            <button
              type="button"
              className="button is-border mr-2 with-icon"
              onClick={onDeposit}
            >
              Deposit
              <Svg name="ArrowDown" />
            </button>
            <button
              type="button"
              className="is-primary button with-icon"
              onClick={onSend}
            >
              Send
              <Svg name="ArrowUp" />
            </button>
          </div>
        </div>
      </div>
      {BodyComponent}
    </section>
  );
}

export default Web3Consumer(Safe);
