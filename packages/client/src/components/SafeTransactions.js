import React from "react";
import { isEmpty } from "lodash";
import Svg from "library/Svg";
import TransactionList from "./TransactionList";
import { useTreasuryTransactions } from "../hooks";

function SafeTransactions({ safeData, address }) {
  const { data: transactions } = useTreasuryTransactions(address);
  let TransactionsComponent = null;

  if (isEmpty(transactions)) {
    TransactionsComponent = (
      <div
        style={{
          height: "calc(100vh - 350px)",
        }}
        className="is-flex is-justify-content-center is-align-items-center is-flex-direction-column"
      >
        <h2 className="is-size-4">You don't have any transaction history</h2>
        <p className="has-text-grey">Create a new transaction above</p>
      </div>
    );
  } else {
    TransactionsComponent = (
      <TransactionList safeData={safeData} transactions={transactions} />
    );
  }

  return (
    <>
      <div className="column p-4 my-5 is-flex is-full rounded-sm border-light">
        <Svg name="Search" className="mr-4" /> Search Transactions
      </div>
      {TransactionsComponent}
    </>
  );
}

export default SafeTransactions;
