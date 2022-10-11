const RemoveAsset = ({ name, address, explanation, onCancel, onNext }) => (
  <div className="p-5">
    <p>
      This action will&nbsp;
      <span className="has-text-weight-bold">
        remove {name} ({address})
      </span>
      &nbsp;from the treasury. {explanation}
    </p>
    <div className="is-flex mt-5">
      <button className="button flex-1 is-border mr-2" onClick={onCancel}>
        Cancel
      </button>
      <button className="button flex-1 is-primary" onClick={onNext}>
        Confirm
      </button>
    </div>
  </div>
);

export default RemoveAsset;
