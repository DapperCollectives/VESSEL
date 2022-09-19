const ThresholdView = ({ actionView, safeData }) => {
  const { newThreshold } = actionView;
  const { safeOwners } = safeData;

  return (
    <div className="pl-4 mb-4">
      <span className="columns">Signature Threshold</span>
      <span className="columns is-size-3 is-family-monospace has-text-black has-text-weight-bold">
        {newThreshold} of {safeOwners?.length} owners
      </span>
    </div>
  );
};

export default ThresholdView;
