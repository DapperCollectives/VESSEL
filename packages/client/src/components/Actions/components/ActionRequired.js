const ActionRequired = ({ actionView, confirmations, onReject, onApprove }) => {
  return (
    <div className="p-5 has-text-grey">
      <div className="flex-1 is-flex is-flex-direction-column">
        {actionView}
      </div>
      <div className="is-flex is-align-items-center mt-6">
        <button className="button flex-1 is-border mr-2" onClick={onReject}>
          Reject
        </button>
        <button className={"button flex-1 is-primary"} onClick={onApprove}>
          Approve
        </button>
      </div>
    </div>
  );
};
export default ActionRequired;
