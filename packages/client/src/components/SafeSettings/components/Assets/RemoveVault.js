const RemoveVault = ({ name, address, onCancel, onNext }) => {
  const nextButtonClasses = ["button flex-1 p-4", "is-link"];

  return (
    <div className="p-5 has-text-grey">
      <div className="flex-1 is-flex is-flex-direction-column">
        <p>
          This action will&nbsp;
          <span className="has-text-weight-bold">
            remove {name} ({address})
          </span>
          &nbsp;from the treasury. This is only possible if your balance for
          this token is 0.
        </p>
      </div>
      <div className="is-flex is-align-items-center mt-5">
        <button className="button flex-1 p-4 mr-2" onClick={onCancel}>
          Cancel
        </button>
        <button className={nextButtonClasses.join(" ")} onClick={onNext}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default RemoveVault;
