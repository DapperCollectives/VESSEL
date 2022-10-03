import React from "react";
import { isEmpty } from "lodash";
import ActionsListTable from "./ActionsListTable";

function ActionsList({
  actions = [],
  onApprove,
  onReject,
  onExecute,
  safeData,
  emptyComponent,
}) {
  if (isEmpty(actions)) {
    return emptyComponent;
  }

  return (
    <ActionsListTable
      safeData={safeData}
      actions={actions}
      onApprove={onApprove}
      onReject={onReject}
      onExecute={onExecute}
    />
  );
}

export default ActionsList;
