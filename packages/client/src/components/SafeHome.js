import React from 'react';
import SafeOverview from './SafeOverview';
import ThingsToDo from './ThingsToDo';
import TransactionHistory from './TransactionHistory';

const SafeHome = ({
  safeData,
  allBalance,
  allNFTs,
  actions,
  address,
  userAddress,
  onApprove,
  onReject,
  onExecute,
}) => (
  <>
    <SafeOverview
      allBalance={allBalance}
      allNFTs={allNFTs}
      safeData={safeData}
      userAddress={userAddress}
    />
    <ThingsToDo
      actions={actions}
      onApprove={onApprove}
      onReject={onReject}
      onExecute={onExecute}
      safeData={safeData}
    />
    <TransactionHistory safeData={safeData} address={address} />
  </>
);

export default SafeHome;
