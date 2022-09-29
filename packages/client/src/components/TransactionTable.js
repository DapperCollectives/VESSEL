import React from "react";
import { useModalContext } from "contexts";
import Svg from "library/Svg";
import { formatActionString, getStatusColor } from "utils";
import { TransactionDetailsModal } from "modals";

const Row = ({ transaction, displayIndex, onView, className }) => {
  const date = new Date(transaction.eventDate);
  const { intent } = transaction.blockEventData.actionView;
  const statusColor = getStatusColor(transaction.status);

  return (
    <tr
      className={`py-4 is-flex is-align-items-center is-justify-content-space-between ${className}`}
    >
      <td className="p-3 flex-1">{String(displayIndex).padStart(2, "0")}</td>
      <td className="p-3 flex-9">{formatActionString(intent)}</td>
      <td className="p-3 flex-2 is-flex is-align-items-center is-hidden-mobile">
        <Svg name="Status" className={`has-text-${statusColor}`} />
        <span className="ml-2 is-capitalized">{transaction.status}</span>
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
  const { openModal, closeModal } = useModalContext();

  const onViewTransaction = (transaction) => {
    const { actionView, signerResponses } = transaction.blockEventData;
    const signers = {};
    safeData.safeOwners.forEach((owner) => {
      let signerStatus = "pending";
      if (signerResponses?.[owner.address] === 0) {
        signerStatus = "approved";
      } else if (signerResponses?.[owner.address] === 1) {
        signerStatus = "rejected";
      }
      signers[owner.address] = signerStatus;
    });
    openModal(
      <TransactionDetailsModal
        onClose={closeModal}
        safeData={safeData}
        // massage data from graffle to work with TransactionDetails
        transaction={{
          status: transaction.status,
          txID: transaction.flowTransactionId,
          date: transaction.eventDate,
          signers,
          ...actionView,
        }}
      />,
      {
        headerTitle: "Transaction Details",
      }
    );
  };

  // only show txs with intent
  const transactionsToShow = transactions
    .filter((tx) => tx?.blockEventData?.actionView?.intent)
    // add statuses based on eventId
    .map((tx) => ({
      ...tx,
      status: tx.flowEventId.includes("ActionDestroyed") ? "rejected" : "approved",
    }));

  return (
    <table className={`border-light rounded-sm ${className}`}>
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
        {transactionsToShow.map((transaction, index) => (
          <Row
            key={transaction.flowTransactionId}
            transaction={transaction}
            displayIndex={index + 1}
            onView={onViewTransaction}
            className={index < arr.length - 1 ? "border-light-bottom" : ""}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
