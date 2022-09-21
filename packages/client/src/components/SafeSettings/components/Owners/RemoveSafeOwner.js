const RemoveSafeOwner = ({ safeOwner, onCancel, onNext}) => {

  const onNextClick = () => {
    onNext(null, { name: safeOwner.name, address: safeOwner.address });
  };

  return (
    <>
      <div className="p-5">
        <h2 className="is-size-4 has-text-black">Remove Owner</h2>
      </div>
      <div className="border-light-top border-light-bottom p-5">
        <div className="flex-1 is-flex is-flex-direction-column">
          <p>
            This action will <b>remove {safeOwner.address} { safeOwner.name ? ["(",safeOwner.name,")"] : "" }</b> from the treasury. 
            The signature threshold will also need to be updated in the next step.
          </p>
        </div>
      </div>
      <div>
        <div className="is-flex is-align-items-center p-5">
          <button className="button flex-1 is-border mr-2 has-text-weight-bold" onClick={onCancel}>
            Cancel
          </button>
          <button
            className= "button flex-1 is-primary has-text-weight-bold"
            onClick={onNextClick}
          >
            Next
          </button>
        </div> 
      </div>
    </>
  );
};

export default RemoveSafeOwner;
