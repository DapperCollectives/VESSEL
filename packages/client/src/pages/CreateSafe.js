import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Web3Consumer } from '../contexts/Web3';
import {
  Loading,
  SafeDetails,
  SafeOwners,
  SignatureRequirements,
  WalletPrompt,
} from '../components';
import { useAddressValidation } from '../hooks';
import { SAFE_TYPES } from 'constants/enums';

const AuthorizeTreasury = ({
  address,
  safeName,
  safeType,
  safeOwners,
  safeOwnersValidByAddress,
  createTreasury,
  creatingTreasury,
  createdTreasury,
  signersAmount,
}) => {
  let isAuthorizeReady = false;
  const history = useHistory();
  if (safeName.trim().length && safeType) {
    const everyOwnerHasValidAddress = Object.values(
      safeOwnersValidByAddress
    ).every((isValid) => isValid);

    if (everyOwnerHasValidAddress) {
      safeOwners.map((so) => (so.verified = true));
      isAuthorizeReady = true;
    }
  }

  const authorizeClases = [
    'button is-primary',
    isAuthorizeReady ? '' : 'disabled',
  ];

  const onAuthorize = async () => {
    await createTreasury({
      name: safeName,
      type: safeType,
      safeOwners,
      threshold: signersAmount,
    });
  };
  const onCancelCreatingSafe = () => {
    history.push('/');
  };
  let stepMessage = 'Create a new safe';
  if (creatingTreasury) stepMessage = 'Your safe is being created...';
  if (createdTreasury) stepMessage = 'Your safe is ready.';

  let stepSubtitle =
    'Step 1 of 2 - You can update this information anytime after it’s been deployed.';
  if (creatingTreasury) {
    stepSubtitle =
      'This may take a few minutes. If the transaction fails, you can cancel or retry below';
  }
  if (createdTreasury) stepSubtitle = '';

  const stepBtnText = creatingTreasury ? 'Retry transaction' : 'Create Safe';

  return (
    <>
      <div className="column is-flex is-full">
        <div className="flex-1">
          <h2 className="is-size-4">{stepMessage}</h2>
          {stepSubtitle && <p className="has-text-grey">{stepSubtitle}</p>}
        </div>
        {!createdTreasury && (
          <div className="is-flex is-align-items-center">
            <button
              onClick={onCancelCreatingSafe}
              className="button is-border mr-2"
            >
              Cancel
            </button>
            <button
              className={authorizeClases.join(' ')}
              onClick={onAuthorize}
              disabled={!isAuthorizeReady}
            >
              {stepBtnText}
            </button>
          </div>
        )}
        {createdTreasury && (
          <div className="is-flex is-align-items-center">
            <NavLink to={`/safe/${address}`}>
              <button className="button is-primary mr-2">Go to safe</button>
            </NavLink>
          </div>
        )}
      </div>
    </>
  );
};

function CreateSafe({ web3 }) {
  const [safeType, setSafeType] = useState(SAFE_TYPES.SOCIAL);
  const [safeName, setSafeName] = useState('');
  const [signersAmount, setSignersAmount] = useState(1);
  const [creatingTreasury, setCreatingTreasury] = useState(false);
  const [createdTreasury, setCreatedTreasury] = useState(false);
  const {
    injectedProvider,
    address,
    loadingTreasuries,
    submittedTransaction,
    createTreasury,
  } = web3;
  const [safeOwners, setSafeOwners] = useState([
    { name: '', address, verified: true },
  ]);
  const [safeOwnersValidByAddress, setSafeOwnersValidByAddress] = useState({});
  const { isAddressValid } = useAddressValidation(injectedProvider);

  const checkSafeOwnerAddressesValidity = async (newSafeOwners) => {
    const newSafeOwnersValidByAddress = {};

    for (const so of newSafeOwners) {
      newSafeOwnersValidByAddress[so.address] = await isAddressValid(
        so.address
      );
    }

    setSafeOwnersValidByAddress(newSafeOwnersValidByAddress);
  };

  const onSafeOwnersChange = (newSafeOwners) => {
    setSafeOwners(newSafeOwners);
    // skip first safe owner since it's the connected user and won't have an address
    checkSafeOwnerAddressesValidity(newSafeOwners.slice(1));
    // force signer amount to not exceed amount of safe owners
    if (newSafeOwners.length < signersAmount) {
      setSignersAmount(newSafeOwners.length);
    }
  };
  const onCreateTreasuryClick = async (treasuryData) => {
    setCreatingTreasury(true);
    await createTreasury(treasuryData);
    setCreatedTreasury(true);
  };
  if (!address) {
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
              submittedTransaction ? '' : 'opacity-5'
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
              createdTreasury ? '' : 'opacity-5'
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
              createdTreasury ? '' : 'opacity-5'
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
        address={address}
        safeOwners={safeOwners}
        safeOwnersValidByAddress={safeOwnersValidByAddress}
        setSafeOwners={onSafeOwnersChange}
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
        address={address}
        safeName={safeName}
        safeType={safeType}
        safeOwners={safeOwners}
        safeOwnersValidByAddress={safeOwnersValidByAddress}
        signersAmount={signersAmount}
        createTreasury={onCreateTreasuryClick}
        creatingTreasury={creatingTreasury}
        createdTreasury={createdTreasury}
      />
      {BodyComponents}
    </section>
  );
}

export default Web3Consumer(CreateSafe);
