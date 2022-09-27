import React from "react";
import SafeTransactions from "./SafeTransactions";

const EmptyTransactions = () => (
  <div className="column p-0 mt-4 is-flex is-full border-light has-shadow rounded-sm">
    <div
      className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
      style={{ minHeight: 175 }}
    >
      No previous transactions
    </div>
  </div>
);

const TransactionHistory = ({ safeData }) => (
  <>
    <div className="column p-0 mt-5 is-flex is-full">
      <h2 className="mb-4">Transaction history</h2>
    </div>
    <SafeTransactions safeData={safeData} emptyComponent={<EmptyTransactions />} />
  </>
);

export default TransactionHistory;
