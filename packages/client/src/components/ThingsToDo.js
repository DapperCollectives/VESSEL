import React from 'react';
import ActionsList from './Actions/ActionsList';

const EmptyActionsList = () => (
  <div className="column p-0 mt-4 is-flex is-full border-light has-shadow rounded-sm">
    <div className="column is-full p-5 is-flex is-justify-content-center is-align-items-center has-text-grey">
      You do not have any pending actions.
    </div>
  </div>
);

const ThingsToDo = ({
  actions = [],
  onApprove,
  onReject,
  onExecute,
  safeData,
}) => (
  <>
    <div className="column p-0 mt-5 is-flex is-full">
      <h2 className="mb-4">Things To Do</h2>
    </div>
    <ActionsList
      actions={actions}
      onApprove={onApprove}
      onReject={onReject}
      onExecute={onExecute}
      safeData={safeData}
      emptyComponent={<EmptyActionsList />}
    />
  </>
);

export default ThingsToDo;
