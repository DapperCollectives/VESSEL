import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  WalletPrompt,
  Loading,
  SafeDetails,
  SafeOwners,
  SignatureRequirements,
} from "../components";
import { Web3Consumer } from "../contexts/Web3";

const AuthorizeTreasury = ({
  addr,
  safeName,
  safeType,
  safeOwners,
  initializeTreasury,
  creatingTreasury,
  createdTreasury,
  signersAmount,
}) => {
  let isAuthorizeReady = false;
  if (safeName.trim().length && safeType) {
    const ownerNames = safeOwners.every((so) => so?.name?.trim().length);
    const ownerAddrs = safeOwners
      .slice(1)
      .every((so) => so?.addr?.trim().length);
    if (ownerNames && ownerAddrs) {
      isAuthorizeReady = true;
    }
  }

  const authorizeClases = [
    "button p-4",
    isAuthorizeReady ? "is-link" : "is-light is-disabled",
  ];

  const onAuthorize = async () => {
    const ownerAddrs = [addr].concat(
      safeOwners.slice(1).map((so) => so?.addr?.trim())
    );
    await initializeTreasury(ownerAddrs, signersAmount);
  };

  let stepMessage = "Create a new safe";
  if (creatingTreasury) stepMessage = "Your safe is being created...";
  if (createdTreasury) stepMessage = "Your safe is ready.";

  let stepSubtitle =
    "Step 1 of 2 - You can update this information anytime after it’s been deployed.";
  if (creatingTreasury)
    stepSubtitle =
      "This may take a few minutes. If the transaction fails, you can cancel or retry below";
  if (createdTreasury) stepSubtitle = "";

  const stepBtnText = creatingTreasury
    ? "Retry transaction"
    : "Sign & Authorize";

  return (
    <>
      <div className="column is-flex is-full">
        <div className="flex-1">
          <h2 className="is-size-4">{stepMessage}</h2>
          {stepSubtitle && <p className="has-text-grey">{stepSubtitle}</p>}
        </div>
        {!createdTreasury && (
          <div className="is-flex is-align-items-center">
            <NavLink to="/">
              <button className="button p-4 mr-2">Cancel</button>
            </NavLink>
            <button className={authorizeClases.join(" ")} onClick={onAuthorize}>
              {stepBtnText}
            </button>
          </div>
        )}
        {createdTreasury && (
          <div className="is-flex is-align-items-center">
            <NavLink to={`/safe/${addr}`}>
              <button className="button is-link p-4 mr-2">Go to safe</button>
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

function CreateSafe({ web3 }) {
  const [safeType, setSafeType] = useState("Social");
  const [safeName, setSafeName] = useState("");
  const [signersAmount, setSignersAmount] = useState(1);
  const addr = web3?.user?.addr;
  const [safeOwners, setSafeOwners] = useState([{ name: "", addr }]);
  const {
    loadingTreasuries,
    creatingTreasury,
    createdTreasury,
    submittedTransaction,
    initializeTreasury,
  } = web3;

  if (!addr) {
    return <WalletPrompt />;
  }

  if (loadingTreasuries) {
    return <Loading message={loadingTreasuries} />;
  }

  const BodyComponents = creatingTreasury ? (
    <>
      <div className="columns column is-full p-0 mt-5">
        <div className="column is-half">
          <div className="border rounded-sm p-4">
            <div className="is-flex column is-full p-0">
              <div className="flex-1 py-6">
                <div className="is-size-4">
                  <b>01</b>
                </div>
                <div>Confirming Transaction</div>
              </div>
              <div className="has-background-black rounded-sm has-text-white is-flex is-align-items-center px-5">
                <b>✔</b>
              </div>
            </div>
          </div>
        </div>
        <div className="column is-half">
          <div
            className={`border rounded-sm p-4 ${
              submittedTransaction ? "" : "opacity-5"
            }`}
          >
            <div className="is-flex column is-full p-0">
              <div className="flex-1 py-6">
                <div className="is-size-4">
                  <b>02</b>
                </div>
                <div>Transaction Submitted</div>
              </div>
              {submittedTransaction && (
                <div className="has-background-black rounded-sm has-text-white is-flex is-align-items-center px-5">
                  <b>✔</b>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="columns column is-full p-0">
        <div className="column is-half">
          <div
            className={`border rounded-sm p-4 ${
              createdTreasury ? "" : "opacity-5"
            }`}
          >
            <div className="is-flex column is-full p-0">
              <div className="flex-1 py-6">
                <div className="is-size-4">
                  <b>03</b>
                </div>
                <div>Validating transaction</div>
              </div>
              {createdTreasury && (
                <div className="has-background-black rounded-sm has-text-white is-flex is-align-items-center px-5">
                  <b>✔</b>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="column is-half">
          <div
            className={`border rounded-sm p-4 ${
              createdTreasury ? "" : "opacity-5"
            }`}
          >
            <div className="is-flex column is-full p-0">
              <div className="flex-1 py-6">
                <div className="is-size-4">
                  <b>04</b>
                </div>
                <div>Safe successfully created</div>
              </div>
              {createdTreasury && (
                <div className="has-background-black rounded-sm has-text-white is-flex is-align-items-center px-5">
                  <b>✔</b>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <SafeDetails
        safeType={safeType}
        setSafeType={setSafeType}
        safeName={safeName}
        setSafeName={setSafeName}
      />
      <SafeOwners
        addr={addr}
        safeOwners={safeOwners}
        setSafeOwners={setSafeOwners}
      />
      <SignatureRequirements
        safeOwners={safeOwners}
        signersAmount={signersAmount}
        setSignersAmount={setSignersAmount}
      />
    </>
  );

  return (
    <section className="section is-flex is-flex-direction-column is-align-items-center has-text-black">
      <AuthorizeTreasury
        addr={addr}
        safeName={safeName}
        safeType={safeType}
        safeOwners={safeOwners}
        signersAmount={signersAmount}
        initializeTreasury={initializeTreasury}
        creatingTreasury={creatingTreasury}
        createdTreasury={createdTreasury}
      />
      {BodyComponents}
    </section>
  );
}

export default Web3Consumer(CreateSafe);
