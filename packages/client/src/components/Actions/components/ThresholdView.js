import ProposedDateView from "./ProposedDateView";

const ThresholdView = ({ actionView, safeData }) => {
  const { newThreshold, timestamp } = actionView;
  const { safeOwners } = safeData;
  console.log(timestamp);

  return (
    <div className="mb-4">
      <span className="column">Signature Threshold</span>
      <span className="column is-size-3 is-family-monospace has-text-black has-text-weight-bold">
        {newThreshold} of {safeOwners?.length} owners
      </span>
      <ProposedDateView timestamp={timestamp} />
    </div>
  );
};

export default ThresholdView;
