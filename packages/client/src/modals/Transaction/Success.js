import React from 'react';
import { useClipboard, useContacts } from 'hooks';
import { getFlowscanUrlForTransaction, getNameByAddress } from 'utils';
import Svg from 'library/Svg';
import BannerInfo from './BannerInfo';

const Success = ({ actionData, txID, onClose, safeName, safeAddress }) => {
  const clipboard = useClipboard();
  const { contacts } = useContacts(safeAddress);

  return (
    <div className="p-5 has-text-black has-text-left">
      <div className="p-5 success-modal-background">
        <label className="has-background-primary-purple has-text-white px-3 py-2 rounded-lg mb-1">
          Sent <Svg name="ArrowUp" />
        </label>
        <BannerInfo
          actionData={actionData}
          contacts={contacts}
          className="pl-4"
        />
      </div>
      <div className="mt-4 border-light-top">
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="flex-1 has-text-grey">Sent From</span>
          <div className="flex-1">
            <span className="has-text-weight-bold">{safeName}</span>
            <div>
              <span className="has-text-grey">{safeAddress}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(safeAddress)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
        <div className="column is-vcentered is-multiline is-mobile border-light-bottom is-flex is-full">
          <span className="has-text-grey flex-1">Sent To</span>
          <div className="flex-1">
            <span className="has-text-weight-bold">
              {getNameByAddress(contacts, actionData.recipient)}
            </span>
            <div>
              <span className="has-text-grey">{actionData.recipient}</span>
              <span
                className="pointer"
                onClick={() => clipboard.copy(actionData.recipient)}
              >
                <Svg name="Copy" className="mt-1 ml-2 pointer" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="is-flex is-justify-content-space-between mt-5">
        <a
          className="button is-border flex-1"
          href={getFlowscanUrlForTransaction(txID)}
          target="_blank"
          rel="noreferrer"
        >
          Flowscan &nbsp;
          <Svg name="OpenNewTab" />
        </a>
        <button className="button is-primary flex-1 ml-2" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Success;
