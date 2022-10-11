import { useContext, useEffect, useState } from 'react';
import { Web3Context } from 'contexts/Web3';
import { useClipboard, useContacts, useFlowFees } from 'hooks';
import { ASSET_TYPES, TRANSACTION_TYPE } from 'constants/enums';
import { COIN_TYPE_TO_META } from 'constants/maps';
import { getNameByAddress } from 'utils';
import Svg from 'library/Svg';
import { isEmpty } from 'lodash';
import { TransferTokensContext } from '../TransferTokensContext';

const TransactionDetails = () => {
  const [transactionFee, setTransactionFee] = useState(0);
  const [sendModalState] = useContext(TransferTokensContext);
  const {
    assetType,
    coinType,
    tokenAmount,
    selectedNFT,
    recipient,
    address,
    transactionType,
  } = sendModalState;

  const clipboard = useClipboard();
  const web3 = useContext(Web3Context);
  const safeAddress =
    transactionType === TRANSACTION_TYPE.SEND ? address : recipient;
  const safeName = web3?.treasuries?.[safeAddress].name;
  const { contacts } = useContacts(safeAddress);

  const senderName =
    transactionType === TRANSACTION_TYPE.SEND
      ? safeName
      : getNameByAddress(contacts, address);

  const recipientName =
    transactionType === TRANSACTION_TYPE.SEND
      ? getNameByAddress(contacts, recipient)
      : safeName;

  const { getProposeSendTokenEstimation } = useFlowFees();

  useEffect(() => {
    const fetchEstimation = async () => {
      const fee = await getProposeSendTokenEstimation();
      setTransactionFee(fee);
    };
    fetchEstimation();
  }, [getProposeSendTokenEstimation]);
  return (
    <div className="p-5">
      {assetType === ASSET_TYPES.TOKEN && (
        <div>
          <p className="has-text-grey">Amount</p>
          <div className="p-0 mb-4 is-flex is-flex-direction-column">
            <span className="is-size-3 has-text-highlight">{tokenAmount}</span>
            <span className="is-flex is-align-item-center">
              <Svg name={coinType} width="24px" height="24px" />
              <strong className="ml-2 mt-1">
                {COIN_TYPE_TO_META[coinType].displayName}
              </strong>
            </span>
          </div>
        </div>
      )}
      {assetType === ASSET_TYPES.NFT && !isEmpty(selectedNFT) && (
        <div className="is-flex is-flex-direction-column is-align-items-start">
          <div className="flex-1">
            <div
              style={{
                cursor: 'pointer',
                height: '150px',
                width: '150px',
                backgroundImage: `url(${selectedNFT.thumbnail.url})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
          <span className="is-size-4">{`#${selectedNFT.tokenId}`}</span>
          <strong>{selectedNFT.name}</strong>
        </div>
      )}
      <div className="mt-5">
        <div className="border-light-top is-flex py-5">
          <span className="has-text-grey flex-1">
            {transactionType === TRANSACTION_TYPE.SEND
              ? 'Sent From'
              : 'Deposit From'}
          </span>
          <div className="is-flex is-flex-direction-column flex-1">
            <strong>{senderName}</strong>
            <span>
              {address}
              <button
                type="button"
                className="pointer border-none has-background-white"
                onClick={() => clipboard.copy(address)}
              >
                <Svg name="Copy" />
              </button>
            </span>
          </div>
        </div>
        <div className="border-light-top is-flex py-5">
          <span className="has-text-grey flex-1">
            {transactionType === TRANSACTION_TYPE.SEND
              ? 'Sent To'
              : 'Deposit To'}
          </span>
          <div className="is-flex is-flex-direction-column flex-1">
            <strong>{recipientName}</strong>
            <span>
              {recipient}
              <button
                type="button"
                className="pointer border-none has-background-white"
                onClick={() => clipboard.copy(recipient)}
              >
                <Svg name="Copy" />
              </button>
            </span>
          </div>
        </div>
        <div className="border-light-top border-light-bottom is-flex is-justify-content-space-between py-5">
          <span className="has-text-grey flex-1">Estimated Network Fee</span>
          <span className="flex-1">
            <strong>
              {`~${transactionFee} `}
              FLOW
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
export default TransactionDetails;
