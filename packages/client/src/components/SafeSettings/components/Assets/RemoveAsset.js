const RemoveAsset = ({ name, address, explanation, onCancel, onNext }) => (
  <>
    <p className="p-5">
      This action will&nbsp;
      <span className="has-text-weight-bold">
        remove {name} ({address})
      </span>
      &nbsp;from the treasury. {explanation}
    </p>
    <div className="is-flex p-5 border-light-top">
      <button
        type="button"
        className="button flex-1 is-border mr-2"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        className="button flex-1 is-primary"
        onClick={onNext}
      >
        Confirm
      </button>
    </div>
  </>
);

export default RemoveAsset;
