import { useContext, useEffect, useState } from "react";
import { shortenAddr } from "utils";
import { SendTokensContext } from "../sendTokensContext";
import { ASSET_TYPES } from "constants/enums";
import { useFlowFees } from "hooks";
const TransactionDetails = () => {
  const [transactionFee, setTransactionFee] = useState(0);
  const [sendModalState] = useContext(SendTokensContext);
  const { assetType, tokenAmount, selectedNFTUrl, recipient } = sendModalState;
  const { getProposeSendTokenEstimation } = useFlowFees();
  useEffect(async () => {
    const fee = await getProposeSendTokenEstimation();
    setTransactionFee(fee);
  }, []);
  return (
    <div>
      {assetType === ASSET_TYPES.TOKEN && (
        <div>
          <label className="has-text-grey">Amount</label>
          <div style={{ position: "relative" }}>
            <span className="is-size-2 column is-full p-0 mb-4">
              {tokenAmount}
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
        <div className="border-light-top is-flex is-justify-content-space-between py-5">
          <span className="has-text-grey">Sending to</span>
          <span>{shortenAddr(recipient)}</span>
        </div>
        <div className="border-light-top is-flex is-justify-content-space-between py-5">
          <span className="has-text-grey">Network fee</span>
          <span>{transactionFee} FLOW</span>
        </div>
        <div className="border-light-top is-flex is-justify-content-space-between py-5">
          <span>Total</span>
          <span>{tokenAmount}</span>
        </div>
      </div>
    </div>
  );
};
export default TransactionDetails;
