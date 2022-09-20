import React from "react";
import { isEmpty } from "lodash";
import TransactionTable from "./TransactionTable";
import { useTreasuryTransactions } from "../hooks";

function TransactionHistory({ safeData }) {
  const { data: transactions } = useTreasuryTransactions(safeData.uuid);
  let TransactionsComponent = null;

  if (isEmpty(transactions)) {
    TransactionsComponent = (
      <div className="column p-0 mt-4 is-flex is-full border-light has-shadow rounded-sm">
        <div
          className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
          style={{ minHeight: 175 }}
        >
          No previous transactions
        </div>
      </div>
    );
  } else {
    TransactionsComponent = <TransactionTable safeData={safeData} transactions={transactions} />;
  }

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h2 className="mb-4">Transaction history</h2>
      </div>
      {TransactionsComponent}
    </>
  );
}

export default TransactionHistory;
