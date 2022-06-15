import React from "react";
import { isEmpty } from "lodash";
import TransactionList from "./TransactionList";
import { useFlowgraphTransactions } from "../hooks";

function TransactionHistory({ safeData, address }) {
  const transactions = useFlowgraphTransactions(address);
  let TransactionsComponent = null;

  // TODO: remove false
  if (false && isEmpty(transactions)) {
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
    TransactionsComponent = (
      <TransactionList safeData={safeData} transactions={transactions} />
    );
  }

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5 mb-4">Transaction history</h4>
      </div>
      {TransactionsComponent}
    </>
  );
}

export default TransactionHistory;
