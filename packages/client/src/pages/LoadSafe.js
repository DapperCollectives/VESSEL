import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Web3Consumer } from '../contexts/Web3';
import { WalletPrompt } from '../components';
import { InputAddress, ProgressBar } from 'library/components';
import { useAddressValidation } from '../hooks';
import { getProgressPercentageForSignersAmount } from '../utils';
import Svg from 'library/Svg';
import { isEmpty } from 'lodash';

const SafeHeader = ({
  safeName,
  safeOwners,
  safeOwnersValidByAddress,
  onContinue = () => {},
}) => {
  let continueReady = false;
  if (safeName.trim().length && !isEmpty(safeOwners)) {
    const everyOwnerHasValidAddress = Object.values(
      safeOwnersValidByAddress
    ).every((isValid) => isValid);

    if (everyOwnerHasValidAddress) {
      continueReady = true;
    }
  }

  const btnClasses = ['button is-primary', continueReady ? '' : 'disabled'];

  const stepMessage = 'Load an existing safe';
  const stepSubtitle =
    'P.S. Your connected wallet does not have to be the owner of this Safe';

  const stepBtnText = 'Add Safe';

  return (
    <>
      <div className="column is-flex is-full">
        <div className="flex-1">
          <h2 className="is-size-4">{stepMessage}</h2>
          {stepSubtitle && <p className="has-text-grey">{stepSubtitle}</p>}
        </div>
        <div className="is-flex is-align-items-center">
          <NavLink to="/">
            <button className="button is-border mr-2">Cancel</button>
          </NavLink>
          <button className={btnClasses.join(' ')} onClick={onContinue}>
            {stepBtnText}
          </button>
        </div>
      </div>
    </>
  );
};

function LoadSafe({ web3 }) {
  const history = useHistory();
  const [safeAddress, setSafeAddress] = useState('');
  const [safeName, setSafeName] = useState('');
  const [threshold, setThreshold] = useState(0);
  const [safeOwners, setSafeOwners] = useState([]);
  const [safeOwnersValidByAddress, setSafeOwnersValidByAddress] = useState({});
  const { injectedProvider, getTreasury, setTreasury, address } = web3;
  const { isAddressValid } = useAddressValidation(injectedProvider);
  if (!address) {
    return <WalletPrompt />;
  }

  const checkSafeOwnerAddressesValidity = async (newSafeOwners) => {
    const newSafeOwnersValidByAddress = {};

    for (const so of newSafeOwners) {
      newSafeOwnersValidByAddress[so.address] = await isAddressValid(
        so.address
      );
    }

    setSafeOwnersValidByAddress(newSafeOwnersValidByAddress);
  };

  const onAddressChange = async ({ value, isValid }) => {
    setSafeAddress(value);
    if (isValid) {
      const treasury = await getTreasury(value);
      const newSafeOwners = Object.keys(treasury?.signers ?? {}).map(
        (signerAddr) => ({
          name: '',
          address: signerAddr,
          verified: true,
        })
      );

      setSafeOwners(newSafeOwners);
      checkSafeOwnerAddressesValidity(newSafeOwners);

      setThreshold(treasury?.threshold ?? 0);
    } else {
      setSafeOwners([]);
      setThreshold(0);
    }
  };

  const onOwnerNameChange = (value, idx) => {
    const newOwners = safeOwners.slice(0);
    newOwners[idx].name = value;
    setSafeOwners([...newOwners]);
  };

  const onSetTreasury = () => {
    setTreasury(safeAddress, {
      name: safeName,
      type: 'Social',
      safeOwners,
      threshold,
    });
    // redirect to new safe
    history.push({
      pathname: `/safe/${safeAddress}`,
    });
  };

  const helperText = isEmpty(safeOwners)
    ? 'After we verify your safe address, we’ll pull in all safe owners below.'
    : 'The name is only stored locally and will never be shared with Vessel or any third parties.';

  const safeOwnerCpts = [];

  if (!isEmpty(safeOwners)) {
    safeOwners.forEach((so, idx) => {
      safeOwnerCpts.push(
        <div className="column is-flex is-full" key={so.address}>
          <div className="flex-1 is-flex is-flex-direction-column pr-5">
            <label className="has-text-grey mb-2">Owner Name</label>
            <input
              className="p-4 rounded-sm border-light"
              type="text"
              placeholder="Add a local owner name"
              value={so.name}
              onChange={(e) => onOwnerNameChange(e.target.value, idx)}
            />
          </div>
          <div className="flex-1 is-flex is-flex-direction-column">
            <label className="has-text-grey mb-2">Owner Address</label>
            <InputAddress value={so.address} readOnly isValid />
          </div>
        </div>
      );
    });
  }

  const progress = getProgressPercentageForSignersAmount(threshold);

  return (
    <section className="section is-flex is-flex-direction-column has-text-black">
      <SafeHeader
        safeName={safeName}
        safeOwners={safeOwners}
        safeOwnersValidByAddress={safeOwnersValidByAddress}
        onContinue={onSetTreasury}
      />
      <div className="column mt-5 is-flex is-full">
        <h2>Safe Details</h2>
      </div>
      <div className="column is-flex is-full">
        <div className="flex-1 is-flex is-flex-direction-column pr-5">
          <label className="has-text-grey mb-2">
            Safe Name
            <span className="has-text-red">*</span>
          </label>
          <input
            className="p-4 rounded-sm border-light"
            type="text"
            placeholder="Choose a local name for your safe"
            value={safeName}
            onChange={(e) => setSafeName(e.target.value)}
          />
        </div>
        <div
          className="flex-1 is-flex is-flex-direction-column"
          style={{ position: 'relative' }}
        >
          <label className="has-text-grey mb-2">
            Safe Address
            <span className="has-text-red">*</span>
          </label>
          <InputAddress
            value={safeAddress}
            onChange={onAddressChange}
            isValid={!isEmpty(safeOwners)}
          />
        </div>
      </div>
      <div className="column is-flex is-full">
        <div className="has-text-grey is-size-6">{helperText}</div>
      </div>
      {!isEmpty(safeOwners) && (
        <div className="column mt-5 is-flex is-full">
          <h4 className="is-size-5">Safe Owners</h4>
        </div>
      )}
      {safeOwnerCpts}
      {!isEmpty(safeOwners) && threshold > 0 && (
        <>
          <div className="column mt-5 is-flex is-full">
            <h4 className="is-size-5">Signature Requirements Set</h4>
          </div>
          <div className="column is-flex is-full">
            <div className="flex-1 is-flex is-flex-direction-column pr-5">
              <label className="has-text-grey mb-2">
                This safe requires {threshold} of {safeOwners.length} owners to
                approve any transactions
              </label>
              <div
                className="is-flex border-light rounded-sm"
                style={{ minHeight: 55 }}
              >
                <div className="px-5 border-light-right">
                  <Svg name="Person" />
                </div>
                <div className="flex-1 is-flex is-align-items-center px-5">
                  {threshold} of{safeOwners.length} owner(s)
                </div>
              </div>
            </div>
            <div className="flex-1 is-flex is-flex-direction-column">
              <div className="is-flex is-justify-content-space-between mb-2">
                <label className="has-text-grey">Security Strength</label>
                <label className="has-text-grey">{progress}%</label>
              </div>
              <div className="is-flex flex-1">
                <div
                  className="is-flex column is-full border-light rounded-sm"
                  style={{ minHeight: 55 }}
                >
                  <ProgressBar progress={progress} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Web3Consumer(LoadSafe);
