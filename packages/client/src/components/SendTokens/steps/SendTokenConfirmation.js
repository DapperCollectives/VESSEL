import React from "react";
import SendModalHeader from "../components/SendModalHeader";
import TransactionDetails from "../components/TransactionDetails";
import ButtonGroup from "../components/ButtonGroup";

const SendTokenConfirmation = () => (
  <div className="has-text-black">
    <SendModalHeader />
    <TransactionDetails />
    <p className="mt-2 px-5 has-text-grey">
      To complete this action, you will have to confirm it with your connected
      wallet on the next step.
    </p>
    <ButtonGroup />
  </div>
);

export default SendTokenConfirmation;
