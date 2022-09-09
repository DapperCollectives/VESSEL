import React from "react";
import { useParams, NavLink } from "react-router-dom";
import QRCode from "react-qr-code";
import { shortenAddr } from "../utils";
import {
  SafeHome,
  SafeTransactions,
  SafeAssets,
  SafeContacts,
  SafeSettings,
  SendTokens,
  TestToolBox,
} from "../components";
import Svg from "library/Svg";
import { Web3Consumer, useModalContext } from "../contexts";
import { useClipboard, useErrorMessage } from "../hooks";
import { TransactionSuccessModal } from "modals";
import { ACTION_TYPES } from "constants/enums";

const ReceiveTokens = ({ name, address }) => {
  const modalContext = useModalContext();
  const clipboard = useClipboard();

  return (
    <div className="p-5 has-text-black has-text-centered">
      <div>
        <h2 className="is-size-4">Receive</h2>
        <div>
          <span className="border-light-right mr-2 pr-2 has-text-grey">
            To: {name}
          </span>
          <span className="is-underlined">{shortenAddr(address)}</span>
        </div>
      </div>
      <div className="border-light-top mt-5 pt-6">
        <QRCode value={`https://flowscan.org/account/${address}`} />
        <div
          className="is-underlined mt-5 pointer"
          onClick={() => clipboard.copy(address)}
        >
          {clipboard.textJustCopied === address
            ? "Copied"
            : "Copy Safe Address"}
        </div>
      </div>
      <div className="is-flex is-align-items-center mt-6">
        <button
          className="button flex-1 p-4 mr-2"
          onClick={() => modalContext.closeModal()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

function Safe({ web3 }) {
  const params = useParams();
  const { address, tab } = params;
  const { openModal, closeModal } = useModalContext();
  const clipboard = useClipboard();

  const { showErrorModal } = useErrorMessage();

  const safeData = web3?.treasuries?.[address];
  const actions = web3?.actions?.[address];
  const allBalance = web3?.balances?.[address];

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
          headerTitle: "Success",
        }
      );
    }
  };

  const currentTab = tab ?? "home";
  const buttons = ["home", "transactions", "assets", "contacts", "settings"];
  const buttonClasses = [
    "button rounded-sm border-none",
    "is-capitalized",
    "mr-2",
  ];

  const ButtonCpts = buttons.map((btn, i) => {
    const classes = [
      ...buttonClasses,
      currentTab === btn
        ? "has-background-purple has-text-primary-purple"
        : "has-text-grey",
    ];
    const baseUrl = `/safe/${address}`;
    const to = btn === "home" ? baseUrl : `${baseUrl}/${btn}`;
    return (
      <NavLink to={to} key={`btn-${i}`}>
        <button className={classes.join(" ")} key={i}>
          {btn}
        </button>
      </NavLink>
    );
  });

  const { injectedProvider, signerApprove, executeAction } = web3;

  const onSignAction = async ({ uuid, intent }) => {
    const latestBlock = await injectedProvider
      .send([injectedProvider.getBlock(true)])
      .then(injectedProvider.decode);

    const { height, id } = latestBlock;
    const intentHex = Buffer.from(intent).toString("hex");

    const message = `${uuid}${intentHex}${id}`;
    const messageHex = Buffer.from(message).toString("hex");

    let sigResponse = await injectedProvider
      .currentUser()
      .signUserMessage(messageHex);

    let keyId = sigResponse[0].keyId;
    let signature = sigResponse[0].signature;

    const keyIds = [keyId];
    const signatures = [signature];

    await signerApprove(
      parseInt(uuid, 10),
      message,
      keyIds,
      signatures,
      height
    ).catch((error) => showErrorModal(error));
  };

  const onConfirmAction = async ({ uuid }) => {
    const events = await executeAction(uuid).catch((error) =>
      showErrorModal(error)
    );
    if (events) {
      const action = events.find((e) => e.type.endsWith("ActionExecuted"));
      showTransactionSuccessModal(action, safeData.name, safeData.address);
    }
  };

  const tabMap = {
    home: (
      <SafeHome
        key="safe-home"
        safeData={safeData}
        allBalance={allBalance}
        actions={actions}
        address={address}
        onSign={onSignAction}
        onConfirm={onConfirmAction}
      />
    ),
    transactions: (
      <SafeTransactions
        key="safe-transactions"
        safeData={safeData}
        address={address}
      />
    ),
    assets: (
      <SafeAssets
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
    openModal(<SendTokens name={safeData.name} address={address} />);
  };

  const onReceive = () => {
    openModal(<ReceiveTokens name={safeData.name} address={address} />);
  };

  return (
    <section
      className="section is-flex is-flex-direction-column has-text-black"
      style={{
        maxWidth: 920 + 48, // based on figma design + padding
      }}
    >
      <div className="column is-full p-0 is-flex is-flex-direction-column mb-5">
        {process.env.REACT_APP_FLOW_ENV !== "mainnet" && (
          <TestToolBox address={address} />
        )}
        <h1 className="is-size-4 mb-2">{safeData.name}</h1>
        <p>
          <span className="has-text-grey">
            Safe address {shortenAddr(address)}
          </span>
          <span
            className="is-underlined ml-2 pointer"
            onClick={() => clipboard.copy(address)}
          >
            {clipboard.textJustCopied === address ? "Copied" : "Copy address"}
          </span>
        </p>
      </div>
      <div className="column is-full p-0 is-flex is-align-items-center">
        <div className="is-flex">{ButtonCpts}</div>
        <div className="is-flex flex-1 is-justify-content-end">
          <div className="w-auto">
            <button
              className="button py-4 px-5 pointer mr-2"
              onClick={onReceive}
            >
              Receive <Svg name="ArrowDown" className="ml-2" />
            </button>
            <button
              className="button py-4 px-5 pointer is-link"
              onClick={onSend}
            >
              Send <Svg name="ArrowUp" className="ml-2 has-text-white" />
            </button>
          </div>
        </div>
      </div>
      {BodyComponent}
    </section>
  );
}

export default Web3Consumer(Safe);
