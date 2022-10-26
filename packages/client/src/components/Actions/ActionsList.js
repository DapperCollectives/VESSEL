import React from 'react';
import { isEmpty } from 'lodash';
import ActionsListTable from './ActionsListTable';

function ActionsList({
  actions = [],
  onApprove,
  onReject,
  onExecute,
  address,
  emptyComponent,
}) {
  if (isEmpty(actions)) {
    return emptyComponent;
  }

  return (
    <ActionsListTable
      address={address}
      actions={actions}
      onApprove={onApprove}
      onReject={onReject}
      onExecute={onExecute}
    />
  );
}

export default ActionsList;
