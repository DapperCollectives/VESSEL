import React from "react";
import { useModalContext } from "contexts";
import Svg from "library/Svg";
import { formatActionString } from "utils";

const maxWidths = {
  index: 50,
  status: 140,
  date: 160,
  action: 70,
};

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

const Column = ({ className = "", children, style = {} }) => (
  <div className={`p-3 is-flex-grow-1 is-flex is-align-items-center ${className}`} style={style}>
    {children}
  </div>
);

const Row = ({ transaction, displayIndex, onView }) => {
  const date = new Date(transaction.eventDate);
  const { intent } = transaction.blockEventData.actionView;
  const status = transaction.flowEventId.includes("ActionDestroyed") ? "rejected" : "confirmed";
  const statusBackground = status === "rejected" ? "has-text-danger" : "has-text-success";

  return (
    <div className="py-4 is-flex is-align-items-center is-justify-content-space-between">
      <Column style={{ maxWidth: maxWidths.index }}>
        {String(displayIndex).padStart(2, "0")}{" "}
      </Column>
      <Column>{formatActionString(intent)}</Column>
      <Column className="is-hidden-mobile" style={{ maxWidth: maxWidths.status }}>
        <Svg name="Status" className={statusBackground} />
        <span className="ml-2 is-capitalized">{status}</span>
      </Column>
      <Column className="is-hidden-mobile has-text-grey" style={{ maxWidth: maxWidths.date }}>
        {date.toLocaleDateString("en-us")}{" "}
        {date.toLocaleTimeString("en-us", { timeStyle: "short" })}
      </Column>
      <Column className="has-text-purple" style={{ maxWidth: maxWidths.action }}>
        <span className="pointer" onClick={() => onView(transaction)}>
          Details
        </span>
      </Column>
    </div>
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
    <div className={`border-light table-border rounded-sm ${className}`}>
      <div className="is-flex has-text-grey border-light-bottom is-hidden-mobile">
        <Column style={{ maxWidth: maxWidths.index }}>#</Column>
        <Column>Info</Column>
        <Column style={{ maxWidth: maxWidths.status }}>Status</Column>
        <Column style={{ maxWidth: maxWidths.date }}>Date</Column>
        <Column style={{ maxWidth: maxWidths.action }}>Action</Column>
      </div>
      {transactionsToShow.map((transaction, index, arr) => (
        <Row
          key={transaction.flowTransactionId}
          transaction={transaction}
          displayIndex={index + 1}
          onView={onViewTransaction}
        />
      ))}
    </div>
  );
};

export default TransactionTable;
