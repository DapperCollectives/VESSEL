import React, { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import QRCode from "react-qr-code";
import { shortenAddr, isAddr } from "../utils";
import {
  SafeHome,
  SafeTransactions,
  SafeAssets,
  SafeContacts,
  SafeSettings,
} from "../components";
import { ArrowDown, ArrowUp, Check } from "../components/Svg";
import { Web3Consumer, useModalContext } from "../contexts";
import { useClipboard, useAddressValidation } from "../hooks";

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

const SendTokens = ({ name, address, web3 }) => {
  const modalContext = useModalContext();
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [recipientValid, setRecipientValid] = useState(false);
  // const [assetType, setAssetType] = useState("FLOW");
  const assetType = "FLOW";
  const { isAddressValid } = useAddressValidation(web3.injectedProvider);

  const continueReady = amount > 0 && recipientValid;
  const btnText = continueReady ? "Sign & Deploy" : "Next";
  const titleText = continueReady ? "Confirm Transaction" : "Send";

  const btnClasses = [
    "button p-4 flex-1",
    continueReady ? "is-link" : "is-light is-disabled",
  ];

  const onSubmit = async () => {
    if (step === 0) {
      return setStep(1);
    }
    if (step === 1) {
      await web3.proposeTransfer(recipient, amount);
      modalContext.closeModal();
    }
  };

  const onRecipientChange = async (e) => {
    let newValue = e.target.value;

    setRecipient(newValue);
    let isValid = isAddr(e.target.value);
    if (isValid) {
      isValid = await isAddressValid(e.target.value);
    }
    setRecipientValid(isValid);
  };

  return (
    <div className="p-5 has-text-black">
      <h2 className="is-size-4">{titleText}</h2>
      <div>
        <span className="border-light-right mr-2 pr-2 has-text-grey">
          From {name}
        </span>
        <span className="is-underlined">{shortenAddr(address)}</span>
      </div>
      <div className="border-light-top mt-4 pt-5">
        <div className="flex-1 is-flex is-flex-direction-column mb-4">
          <label className="has-text-grey mb-2">Asset</label>
          <div className="border-light rounded-sm p-1 is-flex column is-full">
            <button
              className={`button border-none flex-1 ${
                assetType === "FLOW" && "has-background-black has-text-white"
              }`}
            >
              FLOW
            </button>
            <button className="button border-none flex-1">NFTs</button>
          </div>
        </div>
        <label className="has-text-grey">
          Amount{step === 0 && <span className="has-text-red"> *</span>}
        </label>
        {step === 0 ? (
          <input
            type="number"
            className="is-size-2 border-none column is-full p-0 mb-4"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        ) : (
          <span className="is-size-2 column is-full p-0 mb-4">{amount}</span>
        )}
        {step === 0 ? (
          <>
            <label className="has-text-grey mb-2">
              Address{step === 0 && <span className="has-text-red"> *</span>}
            </label>

            <div className="is-flex">
              <div className="flex-1" style={{ position: "relative" }}>
                <input
                  style={{ height: 48 }}
                  className="border-light rounded-sm column is-full p-2 mt-2"
                  type="text"
                  value={recipient}
                  onChange={onRecipientChange}
                />
                {recipientValid && (
                  <div style={{ position: "absolute", right: 17, top: 20 }}>
                    <Check />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span className="has-text-grey">Sending to</span>
            <span>{shortenAddr(recipient)}</span>
          </div>
        )}
        {step === 1 && (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span className="has-text-grey">Network fee</span>
            <span>$0</span>
          </div>
        )}
        {step === 1 && (
          <div className="border-light-top is-flex is-justify-content-space-between py-5">
            <span>Total</span>
            <span>{amount}</span>
          </div>
        )}
        <div className="is-flex is-align-items-center mt-6">
          <button className="button flex-1 p-4 mr-2" onClick={() => setStep(0)}>
            Cancel
          </button>
          <button className={btnClasses.join(" ")} onClick={onSubmit}>
            {btnText}
          </button>
        </div>
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
  const balance = web3?.balances?.[address] ?? 0;

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

  const { injectedProvider, signerApprove, executeAction, sendFlowToTreasury } =
    web3;

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
    const sigMessage =
      sigResponse[0]?.signature?.signature ?? sigResponse[0]?.signature;
    const keyIds = [sigResponse[0]?.keyId];
    const signatures = [sigMessage];
    await signerApprove(
      parseInt(uuid, 10),
      message,
      keyIds,
      signatures,
      height
    );
  };

  const onConfirmAction = async ({ uuid }) => {
    await executeAction(parseInt(uuid, 10));
  };

  const onDeposit = async () => {
    await sendFlowToTreasury(10);
  };

  const tabMap = {
    home: (
      <SafeHome
        key="safe-home"
        safeData={safeData}
        balance={balance}
        actions={actions}
        address={address}
        onSign={onSignAction}
        onConfirm={onConfirmAction}
      />
    ),
    transactions: <SafeTransactions key="safe-transactions" />,
    assets: <SafeAssets key="safe-assets" />,
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
      <SendTokens
        name={safeData.name}
        address={address}
        web3={web3}
        balance={balance}
      />
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
          <span className="is-underlined ml-4 pointer" onClick={onDeposit}>
            Deposit
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
