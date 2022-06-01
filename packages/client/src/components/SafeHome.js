import React from "react";
import SafeOverview from "./SafeOverview";
import ThingsToDo from "./ThingsToDo";
import TransactionHistory from "./TransactionHistory";

const SafeHome = (props) => (
  <>
    <SafeOverview {...props} />
    <ThingsToDo {...props} />
    <TransactionHistory {...props} />
  </>
);

export default SafeHome;
