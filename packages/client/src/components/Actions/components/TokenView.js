import Svg from "library/Svg";
import { getTokenMeta } from "utils";
import ProposedDateView from "./ProposedDateView";
import SentFromToView from "./SentFromToView";

const TokenView = ({ actionView, safeData }) => {
  const { recipient, vaultId, tokenAmount, timestamp } = actionView;

  const { displayName, tokenType } = getTokenMeta(vaultId) || {};

  return (
    <div className="is-size-6">
      <p>Amount</p>
      <div>
        <span className="is-size-2 is-family-monospace has-text-black">
          {Number(tokenAmount).toLocaleString()}
        </span>
      </div>

      <div className="is-flex is-flex-direction-row is-justify-content-flex-start mb-5">
        <Svg name={tokenType} />
        <label className="ml-2 pt-.5 has-text-black">{displayName}</label>
      </div>

      <ProposedDateView timestamp={timestamp} />
      <SentFromToView safeData={safeData} recipient={recipient} />
    </div>
  );
};
export default TokenView;
