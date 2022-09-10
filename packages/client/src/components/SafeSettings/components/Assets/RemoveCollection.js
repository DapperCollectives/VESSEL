const RemoveCollection = ({ name, address, onCancel, onNext }) => {
  return (
    <div className="p-5 has-text-grey">
      <p>
        This action will&nbsp;
        <span className="has-text-weight-bold">
          remove {name} ({address})
        </span>
        &nbsp;from the treasury. This is only possible if you don’t have any NFT
        from this collection in your treasury.
      </p>
      <div className="is-flex is-align-items-center mt-5">
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

export default RemoveCollection;
