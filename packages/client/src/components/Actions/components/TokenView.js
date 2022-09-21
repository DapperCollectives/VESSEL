import Svg from "library/Svg";
import { getTokenMeta } from "utils";
import ProposedDateView from "./ProposedDateView";
import SentFromToView from "./SentFromToView";

const TokenView = ({ actionView, safeData }) => {
  const { recipient, vaultId, tokenAmount, timestamp } = actionView;

  const { displayName, tokenType } = getTokenMeta(vaultId) || {};

  return (
    <>
      <div className="pl-4 mb-5">
        <span className="column">Amount</span>
        <span className="column is-size-2 is-family-monospace has-text-black">
          {Number(tokenAmount).toLocaleString()}
        </span>
        <span className="column is-size-6 has-text-weight-bold has-text-black">
          <Svg name={tokenType} /> &nbsp; {displayName}
        </span>
      </div>
      <div className="mt-4">
        <ProposedDateView timestamp={timestamp} />
        <SentFromToView safeData={safeData} recipient={recipient} />
      </div>
    </>
  );
};
export default TokenView;
