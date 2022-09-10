const RemoveVault = ({ name, address, onCancel, onNext }) => {
  return (
    <div className="p-5 has-text-grey">
      <p>
        This action will&nbsp;
        <span className="has-text-weight-bold">
          remove {name} ({address})
        </span>
        &nbsp;from the treasury. This is only possible if your balance for this
        token is 0.
      </p>
      <div className="is-flex mt-5">
        <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button className="button flex-1 p-4 is-link" onClick={onNext}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default RemoveVault;
