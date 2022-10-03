import React from 'react';
import { InputAddress } from 'library/components';
import Svg from 'library/Svg';

function SafeOwners({ address, safeOwners, setSafeOwners }) {
  const onOwnerNameChange = (value, idx) => {
    const newOwners = safeOwners.slice(0);
    newOwners[idx].name = value;
    setSafeOwners([...newOwners]);
  };

  const onOwnerAddressChange = (value, isValid, idx) => {
    const newOwners = safeOwners.slice(0);
    newOwners[idx].address = value;
    newOwners[idx].isValid = isValid;
    setSafeOwners([...newOwners]);
  };

  const safeOwnerCpts = [
    <div className="column is-flex is-full" key={address}>
      <div className="flex-1 is-flex is-flex-direction-column pr-5">
        <label className="has-text-grey mb-2">Owner Name</label>
        <input
          className="p-4 rounded-sm border-light"
          type="text"
          placeholder="Add a local owner name"
          value={safeOwners.find((so) => so.address === address)?.name}
          onChange={(e) => onOwnerNameChange(e.target.value, 0)}
        />
      </div>
      <div className="flex-1 is-flex is-flex-direction-column">
        <label className="has-text-grey mb-2">Owner Address</label>
        <InputAddress value={address} isValid readOnly />
      </div>
    </div>,
  ];

  if (safeOwners.length > 1) {
    // skip first safe owner as that is always connected user
    safeOwners.slice(1).forEach((so, idx) => {
      safeOwnerCpts.push(
        <div className="column is-flex is-full" key={`extra-owner-${idx}`}>
          <div className="flex-1 is-flex is-flex-direction-column pr-5">
            <label className="has-text-grey mb-2">Owner Name</label>
            <input
              className="p-4 rounded-sm border-light"
              type="text"
              placeholder="Add a local owner name"
              value={so?.name}
              onChange={(e) => onOwnerNameChange(e.target.value, idx + 1)}
            />
          </div>
          <div className="flex-1 is-flex is-flex-direction-column">
            <label className="has-text-grey mb-2">
              Owner Address
              <span className="has-text-red">*</span>
            </label>
            <div className="is-flex">
              <InputAddress
                className="flex-1"
                value={so?.address}
                onChange={({ value, isValid }) =>
                  onOwnerAddressChange(value, isValid, idx + 1)
                }
                isValid={so?.isValid}
              />
              <button
                className="button is-border ml-2 p-4"
                onClick={() => {
                  const newOwners = safeOwners.filter(
                    (_, soIdx) => soIdx !== idx + 1
                  );
                  setSafeOwners(newOwners);
                }}
              >
                <Svg name="Trash" />
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="column mt-5 is-flex is-full is-justify-content-space-between">
        <h4 className="is-size-5">Safe Owners</h4>
        <button
          className="button is-secondary is-small"
          onClick={() => {
            setSafeOwners(safeOwners.concat({ name: '', address: '' }));
          }}
        >
          Add another owner
        </button>
      </div>
      {safeOwnerCpts}
      <div className="column is-flex is-flex-direction-column is-full">
        <p className="mt-4 has-text-grey">
          Tip: For additional security, add more than one owner. More owners can
          also be added after your safe is deployed.
        </p>
      </div>
    </>
  );
}

export default SafeOwners;
