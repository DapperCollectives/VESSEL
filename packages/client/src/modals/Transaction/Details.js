import Signatures from 'components/Signatures';
import { useClipboard, useContacts } from 'hooks';
import { ACTION_TYPES } from 'constants/enums';
import { getFlowscanUrlForTransaction, getStatusColor } from 'utils';
import Svg from 'library/Svg';
import BannerInfo from './BannerInfo';

const TransactionDetails = ({ onClose, safeData = {}, transaction = {} }) => {
  const { recipient, date, status, signers } = transaction;
  const clipboard = useClipboard();
  const statusColor = getStatusColor(status);
  const { contacts } = useContacts(safeData.address);
  const actionType = transaction.type;
  const { name, threshold, address, safeOwners } = safeData;

  return (
    <>
      <div
        className="has-background-purple rounded-sm m-5 p-5"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Svg
          name="LogoV"
          style={{
            position: 'absolute',
            top: '0px',
            right: '-30px',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <label
            className={`has-background-${statusColor} has-text-white px-3 py-2 rounded-lg mb-1 is-capitalized`}
          >
            {status}
          </label>
          <BannerInfo
            actionData={transaction}
            contacts={contacts}
            signers={signers}
            className="pl-4"
          />
        </div>
      </div>
      <div className="px-5">
        <div className="is-flex py-4 border-light-top">
          <span className="has-text-grey flex-1">Executed On</span>
          <div className="flex-1">
            <b>
              {new Date(date).toLocaleDateString('en-us')}{' '}
              {new Date(date).toLocaleTimeString('en-us', {
                timeStyle: 'short',
              })}
            </b>
          </div>
        </div>
        {(actionType === ACTION_TYPES.TRANSFER_TOKEN ||
          actionType === ACTION_TYPES.TRANSFER_NFT) && (
          <>
            <div className="border-light-top is-flex py-4">
              <div className="flex-1 has-text-grey">Sent from</div>
              <div className="flex-1">
                <div>
                  <b>{name}</b>
                </div>
                <div>
                  <span className="has-text-grey">{address}</span>
                  <span
                    className="pointer"
                    onClick={() => clipboard.copy(address)}
                  >
                    <Svg name="Copy" className="mt-1 ml-2 pointer" />
                  </span>
                </div>
              </div>
            </div>
            <div className="border-light-top is-flex py-4">
              <div className="flex-1 has-text-grey">Sent to</div>
              <div className="flex-1">
                <div>
                  <b>{recipient}</b>
                  <span
                    className="pointer"
                    onClick={() => clipboard.copy(recipient)}
                  >
                    <Svg name="Copy" className="mt-1 ml-2 pointer" />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        {(actionType === ACTION_TYPES.ADD_SIGNER_UPDATE_THRESHOLD ||
          actionType === ACTION_TYPES.REMOVE_SIGNER_UPDATE_THRESHOLD ||
          actionType === ACTION_TYPES.UPDATE_THRESHOLD) && (
          <div className="border-light-top is-flex py-4">
            <div className="flex-1 has-text-grey">Signature Threshold</div>
            <div className="flex-1 has-text-weight-bold">
              {threshold} of {Object.keys(signers).length} owners
            </div>
          </div>
        )}
        <div className="border-light-top pb-4 has-text-grey">
          <Signatures safeOwners={safeOwners} confirmations={signers} />
        </div>
      </div>
      <div className="is-flex border-light-top mt-5 p-5">
        <a
          className="button is-border flex-1"
          href={getFlowscanUrlForTransaction(transaction.txID)}
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
    </>
  );
};

export default TransactionDetails;
