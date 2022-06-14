import React from "react";
import { useModalContext } from "../contexts";
import { shortenAddr } from "../utils";
import TransactionStatusIcon from "./TransactionStatusIcon";

function TransactionDetails({ transaction, onClose }) {
  const renderConfirmation = (address) => {
    return (
      <div className="has-background-black rounded-sm has-text-white is-flex is-align-items-center p-4 mr-2">
        {shortenAddr(address)}
      </div>
    );
  };

  const renderConfirmationsRow = () => {
    return (
      <div className="pt-4">
        <div className="is-flex is-align-items-center is-justify-content-space-between mb-3 has-text-grey">
          <div>Confirmations</div>
          <div>4 out of 4</div>
        </div>
        <div
          className="pb-5 is-flex is-align-items-center is-fullwidth"
          style={{ overflow: "auto" }}
        >
          {renderConfirmation("0001")}
          {renderConfirmation("0002")}
          {renderConfirmation("0003")}
          {renderConfirmation("0004")}
          {renderConfirmation("0005")}
          {renderConfirmation("0006")}
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

  return (
    <>
      <div className="p-5 has-text-black">
        <h2 className="is-size-4">Transaction details</h2>
        <p className="has-text-grey">Executed on 10/06/22 at 12:45 PM</p>
      </div>
      <div className="border-light-top p-5">
        <div className="flex-1 is-flex is-flex-direction-column">
          {renderConfirmationsRow()}
          {renderRow("Sent", "0.8 ETH")}
          {renderRow("Recipient", "No name", true)}
          {renderRow("Address", shortenAddr("TODO"))}
          {renderRow("Executed", shortenAddr("TODO"))}
          {renderRow("Created", "October 6, 2021, 10:47:18 PM")}
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

function TransactionListItem({ transaction, index, isLastInList, onView }) {
  const classes = [
    "is-flex is-align-items-center is-justify-content-space-between py-4 border-light-top",
    isLastInList && "border-light-bottom",
  ];

  return (
    <div className={classes.join(" ")}>
      <div className="column">{String(index + 1).padStart(2, "0")}</div>
      <div className="column">Received</div>
      <div className="column">
        <TransactionStatusIcon status="confirmed" />
        <span className="ml-2">Confirmed</span>
      </div>
      <div className="column">0.1 ETH</div>
      <div className="column has-text-grey">02/28/22</div>
      <div className="column has-text-grey">7:28 AM EST</div>
      <div className="column has-text-right">
        <span className="is-underlined pointer" onClick={() => onView()}>
          View
        </span>
      </div>
    </div>
  );
}

function TransactionList({ transactions = [{ foo: "bar" }] }) {
  const modalContext = useModalContext();

  const onViewTransaction = (transaction) => {
    modalContext.openModal(
      <TransactionDetails
        transaction={transaction}
        onClose={() => modalContext.closeModal()}
      />
    );
  };

  return transactions.map((transaction, index) => {
    // TODO: key
    return (
      <TransactionListItem
        transaction={transaction}
        index={index}
        isLastInList={index === transactions.length - 1}
        onView={onViewTransaction}
      />
    );
  });
}

export default TransactionList;
