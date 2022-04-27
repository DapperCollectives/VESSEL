import React from "react";
import { isEmpty } from "lodash";
import { Search } from "./Svg";

function SafeTransactions(props) {
  let TransactionsComponent = null;
  if (isEmpty(props.transactions) && isEmpty(props.intents)) {
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
  }

  return (
    <>
      <div className="column p-4 mt-5 is-flex is-full rounded-sm border-light">
        <Search className="mr-4" /> Search Transactions
      </div>
      {TransactionsComponent}
    </>
  );
}

export default SafeTransactions;
