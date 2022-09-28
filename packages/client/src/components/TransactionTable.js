import React from "react";
import { useModalContext } from "contexts";
import Svg from "library/Svg";
import { formatActionString } from "utils";

const TransactionDetails = ({ transaction, onClose }) => {
  const date = new Date(transaction.eventDate);
  return (
    <>
      <div className="p-5 has-text-black">
        <h2 className="is-size-4">Transaction details</h2>
        <p className="has-text-grey">
          Executed on {date.toLocaleDateString("en-us")} at {date.toLocaleTimeString("en-us")}
        </p>
      </div>
      <div className="border-light-top p-5">
        <div className="flex-1 is-flex is-flex-direction-column">
          <div className="is-flex is-align-items-center mt-4">
            <button className="button flex-1 p-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Row = ({ transaction, displayIndex, onView }) => {
  const date = new Date(transaction.eventDate);
  const { intent } = transaction.blockEventData.actionView;
  const status = transaction.flowEventId.includes("ActionDestroyed") ? "rejected" : "confirmed";
  const statusBackground = status === "rejected" ? "has-text-danger" : "has-text-success";

  return (
    <tr className="py-4 is-flex is-align-items-center is-justify-content-space-between">
      <td className="p-3 flex-1">{String(displayIndex).padStart(2, "0")}</td>
      <td className="p-3 flex-9">{formatActionString(intent)}</td>
      <td className="p-3 flex-2 is-flex is-align-items-center is-hidden-mobile">
        <Svg name="Status" className={statusBackground} />
        <span className="ml-2 is-capitalized">{status}</span>
      </td>
      <td className="p-3 flex-3 is-hidden-mobile has-text-grey">
        {date.toLocaleDateString("en-us")}{" "}
        {date.toLocaleTimeString("en-us", { timeStyle: "short" })}
      </td>
      <td className="p-3 flex-2 has-text-purple">
        <span className="pointer" onClick={() => onView(transaction)}>
          Details
        </span>
      </td>
    </tr>
  );
};

const TransactionTable = ({ safeData, transactions = [], className = "" }) => {
  const modalContext = useModalContext();

  const onViewTransaction = (transaction) => {
    modalContext.openModal(
      <TransactionDetails
        safeOwners={safeData.safeOwners}
        transaction={transaction}
        onClose={() => modalContext.closeModal()}
      />
    );
  };

  // only show txs with intent
  const transactionsToShow = transactions.filter((tx) => tx?.blockEventData?.actionView?.intent);

  return (
    <table className={`border-light table-border rounded-sm ${className}`}>
      <thead>
        <tr className="is-flex has-text-grey border-light-bottom is-hidden-mobile">
          <th className="p-3 flex-1">#</th>
          <th className="p-3 flex-9">Info</th>
          <th className="p-3 flex-2">Status</th>
          <th className="p-3 flex-3">Date</th>
          <th className="p-3 flex-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {transactionsToShow.map((transaction, index, arr) => (
          <Row
            key={transaction.flowTransactionId}
            transaction={transaction}
            displayIndex={index + 1}
            onView={onViewTransaction}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
