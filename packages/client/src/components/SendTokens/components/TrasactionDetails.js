import { useContext, useEffect, useState } from "react";
import { useFlowFees, useClipboard } from "hooks";
import { Web3Context } from "contexts/Web3";
import { ASSET_TYPES } from "constants/enums";
import { COIN_TYPE_TO_META } from "constants/maps";
import Svg from "library/Svg";
import { SendTokensContext } from "../sendTokensContext";

const TransactionDetails = () => {
  const [transactionFee, setTransactionFee] = useState(0);
  const [sendModalState] = useContext(SendTokensContext);
  const {
    assetType,
    coinType,
    tokenAmount,
    selectedNFTUrl,
    recipient,
    address,
  } = sendModalState;
  const web3 = useContext(Web3Context);
  const { safeOwners } = web3?.treasuries?.[address];
  const recipientName =
    safeOwners.find((owner) => owner.address === recipient)?.name ?? "";
  const clipboard = useClipboard();
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
      {assetType === ASSET_TYPES.NFT && (
        <div
          style={{
            cursor: "pointer",
            height: 150,
            backgroundImage: `url(${selectedNFTUrl})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      <div className="mt-5">
        <div className="border-light-top is-flex py-5">
          <span className="has-text-grey flex-1">Sent From</span>
          <div className="is-flex is-flex-direction-column flex-1">
            <strong>Creature Treasury</strong>
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
          <span className="has-text-grey flex-1">Sent To</span>
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
              {`${transactionFee} `}
              FLOW
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};
export default TransactionDetails;
