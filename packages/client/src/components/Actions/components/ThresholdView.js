import ProposedDateView from "./ProposedDateView";

const ThresholdView = ({ actionView, safeData }) => {
  const { newThreshold, timestamp } = actionView;
  const { safeOwners } = safeData;

  return (
    <div className="is-size-6">
      <div className="pb-2">Signature Threshold</div>
      <div className="pb-2 is-size-3 is-family-monospace has-text-black has-text-weight-bold">
        {newThreshold} of {safeOwners?.length} owners
      </div>
      <ProposedDateView timestamp={timestamp} />
    </div>
  );
};

export default ThresholdView;
