import React from "react";

function TransactionList({ transactions = [] }) {
  const TransactionComponents = [];
  if (!transactions.length) {
    TransactionComponents.push(
      <div
        className="column p-0 mt-4 is-flex is-full border-light has-shadow rounded-sm"
        key="empty-transactions"
      >
        <div
          className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
          style={{ minHeight: 175 }}
        >
          No previous transactions
        </div>
      </div>
    );
  }

  return TransactionComponents;
}

export default TransactionList;
