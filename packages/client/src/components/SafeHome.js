import React from "react";
import SafeOverview from "./SafeOverview";
import ThingsToDo from "./ThingsToDo";
import TransactionHistory from "./TransactionHistory";

const SafeHome = ({
  safeData,
  allBalance,
  allNFTs,
  actions,
  address,
  onSign,
  onConfirm,
}) => (
  <>
    <SafeOverview allBalance={allBalance} allNFTs={allNFTs} />
    <ThingsToDo
      actions={actions}
      onSign={onSign}
      onConfirm={onConfirm}
      safeData={safeData}
    />
    <TransactionHistory safeData={safeData} address={address} />
  </>
);

export default SafeHome;
