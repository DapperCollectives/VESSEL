import React from "react";
import SendModalHeader from "../components/SendModalHeader";
import AddressInput from "../components/AddressInput";
import TransactionDetails from "../components/TrasactionDetails";
import ButtonGroup from "../components/ButtonGroup";

const SendTokenConfirmation = () => {
  return (
    <div className="p-5 has-text-black">
      <SendModalHeader />
      <AddressInput displayOnly />
      <TransactionDetails />
      <ButtonGroup />
      <p>
        You're about to create a transaction and will have to confirm it with
        your currently connected wallet.
      </p>
    </div>
  );
};
export default SendTokenConfirmation;
