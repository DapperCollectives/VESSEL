import React from "react";
import { isEmpty } from "lodash";
import TransactionTable from "./TransactionTable";
import { useTreasuryTransactions } from "hooks";

function SafeTransactions({ safeData, emptyComponent, className }) {
  const { data: transactions } = useTreasuryTransactions(safeData.uuid);
  if (isEmpty(transactions)) {
    return emptyComponent;
  }

  return <TransactionTable safeData={safeData} transactions={transactions} className={className} />;
}

export default SafeTransactions;
