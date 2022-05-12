import React from "react";
import SafeOverview from "./SafeOverview";
import ThingsToDo from "./ThingsToDo";
import TransactionHistory from "./TransactionHistory";

const SafeHome = () => (
  <>
    <SafeOverview />
    <ThingsToDo />
    <TransactionHistory />
  </>
);

export default SafeHome;
