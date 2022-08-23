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
import { ArrowDown, ArrowUp } from "../components/Svg";
import { Web3Consumer, useModalContext } from "../contexts";
import { useClipboard } from "../hooks";

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
  const modalContext = useModalContext();
  const clipboard = useClipboard();

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

  const currentTab = tab ?? "home";
  const buttons = ["home", "transactions", "assets", "contacts", "settings"];
  const buttonClasses = [
    "button rounded-lg border-none",
    "is-capitalized",
    "mr-2",
  ];

  const ButtonCpts = buttons.map((btn, i) => {
    const classes = [
      ...buttonClasses,
      currentTab === btn
        ? "has-background-black has-text-white"
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
    // Temporary workaround for Blocto to send the correct key for signing the messages
    if (sigResponse.length > 1 && sigResponse[1].keyId === 0) {
      keyId = sigResponse[1].keyId;
      signature = sigResponse[1].signature;
    }
    const keyIds = [keyId];
    const signatures = [signature];

    await signerApprove(
      parseInt(uuid, 10),
      message,
      keyIds,
      signatures,
      height
    );
  };

  const onConfirmAction = async ({ uuid }) => {
    await executeAction(uuid);
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
    contacts: (
      <SafeContacts safeOwners={safeData?.safeOwners} key="safe-contacts" />
    ),
    settings: (
      <SafeSettings
        address={address}
        web3={web3}
        {...safeData}
        key="safe-settings"
      />
    ),
  };

  const BodyComponent = tabMap[currentTab];

  const onSend = () => {
    modalContext.openModal(
      <SendTokens name={safeData.name} address={address} />
    );
  };

  const onReceive = () => {
    modalContext.openModal(
      <ReceiveTokens name={safeData.name} address={address} />
    );
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
        <h2 className="is-size-4 mb-2">{safeData.name}</h2>
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
              Receive <ArrowDown className="ml-2" />
            </button>
            <button
              className="button py-4 px-5 pointer is-link"
              onClick={onSend}
            >
              Send <ArrowUp className="ml-2 has-text-white" />
            </button>
          </div>
        </div>
      </div>
      {BodyComponent}
    </section>
  );
}

export default Web3Consumer(Safe);
