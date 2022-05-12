import React from "react";
import TransactionList from "./TransactionList";

function TransactionHistory(props) {
  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Transaction history</h4>
      </div>
      <TransactionList {...props} />
    </>
  );
}

export default TransactionHistory;
