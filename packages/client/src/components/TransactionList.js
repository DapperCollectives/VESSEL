import React from "react";
import { useModalContext } from "../contexts";
import { shortenAddr } from "../utils";
import TransactionStatusIcon from "./TransactionStatusIcon";

const FALLBACK_RECIPIENT_NAME = "No name";

function getDisplayStringForTokenTransfer(tokenTransfer) {
  if (!tokenTransfer) {
    return "";
  }

  const amount = parseFloat(tokenTransfer.amount.value ?? "0");
  const token = tokenTransfer.amount.token.id
    .split(".")[2]
    .replace("Token", "")
    .toUpperCase();

  return `${amount} ${token}`;
}

function TransactionDetails({ safeOwners, transaction, onClose }) {
  const renderConfirmation = (address) => {
    return (
      <div
        key={address}
        className="has-background-black rounded-sm has-text-white is-flex is-align-items-center p-4 mr-2"
      >
        {shortenAddr(address)}
      </div>
    );
  };

  const renderConfirmationsRow = () => {
    return (
      <div className="pt-4">
        <div className="is-flex is-align-items-center is-justify-content-space-between mb-3 has-text-grey">
          <div>Confirmations</div>
          <div>
            {transaction.authorizers.length} out of {safeOwners.length}
          </div>
        </div>
        <div
          className="pb-5 is-flex is-align-items-center is-fullwidth"
          style={{ overflow: "auto" }}
        >
          {transaction.authorizers.map(({ address }) =>
            renderConfirmation(address)
          )}
        </div>
      </div>
    );
  };

  const renderRow = (label, value, labelIsGrey) => {
    return (
      <div className="is-flex is-align-items-center is-justify-content-space-between py-5 border-light-top">
        <label className="has-text-grey">{label}</label>
        <div className={`has-text-${labelIsGrey ? "grey" : "black"}`}>
          {value}
        </div>
      </div>
    );
  };

  const date = new Date(transaction.time);
  const lastTokenTransfer =
    transaction.tokenTransfers[transaction.tokenTransfers.length - 1];
  const recipientName =
    (lastTokenTransfer &&
      safeOwners.find(
        ({ address }) => address === lastTokenTransfer.counterparty.address
      )?.name) ??
    FALLBACK_RECIPIENT_NAME;

  return (
    <>
      <div className="p-5 has-text-black">
        <h2 className="is-size-4">Transaction details</h2>
        <p className="has-text-grey">
          Executed on {date.toLocaleDateString("en-us")} at{" "}
          {date.toLocaleTimeString("en-us")}
        </p>
      </div>
      <div className="border-light-top p-5">
        <div className="flex-1 is-flex is-flex-direction-column">
          {renderConfirmationsRow()}
          {renderRow(
            "Sent",
            getDisplayStringForTokenTransfer(lastTokenTransfer)
          )}
          {renderRow(
            "Recipient",
            recipientName,
            recipientName === FALLBACK_RECIPIENT_NAME
          )}
          {renderRow(
            "Address",
            lastTokenTransfer
              ? shortenAddr(lastTokenTransfer.counterparty.address)
              : ""
          )}
          {renderRow("Executed", shortenAddr(transaction.payer.address))}
          {renderRow(
            "Created",
            `${date.toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}, ${date.toLocaleTimeString("en-us")}`
          )}
          <div className="is-flex is-align-items-center mt-4">
            <button className="button flex-1 p-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TransactionListItem({
  transaction,
  displayIndex,
  isLastInList,
  onView,
}) {
  const classes = [
    "is-flex is-align-items-center is-justify-content-space-between py-4 border-light-top",
    isLastInList && "border-light-bottom",
  ];
  const date = new Date(transaction.time);
  const lastTokenTransfer =
    transaction.tokenTransfers[transaction.tokenTransfers.length - 1];

  return (
    <div className={classes.join(" ")}>
      <div className="column">{String(displayIndex + 1).padStart(2, "0")}</div>
      <div className="column">{lastTokenTransfer?.type ?? "Received"}</div>
      <div className="column">
        <TransactionStatusIcon status={transaction.status} />
        <span className="ml-2">{transaction.status}</span>
      </div>
      <div className="column">
        {getDisplayStringForTokenTransfer(lastTokenTransfer)}
      </div>
      <div className="column has-text-grey">
        {date.toLocaleDateString("en-us")}
      </div>
      <div className="column has-text-grey">
        {date.toLocaleTimeString("en-us")}
      </div>
      <div className="column has-text-right">
        <span
          className="is-underlined pointer"
          onClick={() => onView(transaction)}
        >
          View
        </span>
      </div>
    </div>
  );
}

function TransactionList({ safeData, transactions = [{ foo: "bar" }] }) {
  const modalContext = useModalContext();

  console.log({ transactions });

  const onViewTransaction = (transaction) => {
    modalContext.openModal(
      <TransactionDetails
        safeOwners={safeData.safeOwners}
        transaction={transaction}
        onClose={() => modalContext.closeModal()}
      />
    );
  };

  return transactions.map((transaction, index) => {
    return (
      <TransactionListItem
        key={transaction.hash}
        transaction={transaction}
        displayIndex={transactions.length - index}
        isLastInList={index === transactions.length - 1}
        onView={onViewTransaction}
      />
    );
  });
}

export default TransactionList;
