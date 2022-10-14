import React from 'react';
import SafeOverview from './SafeOverview';
import ThingsToDo from './ThingsToDo';
import TransactionHistory from './TransactionHistory';

const SafeHome = ({
  allBalance,
  allNFTs,
  actions,
  address,
  onApprove,
  onReject,
  onExecute,
}) => (
  <>
    <SafeOverview allBalance={allBalance} allNFTs={allNFTs} address={address} />
    <ThingsToDo
      actions={actions}
      onApprove={onApprove}
      onReject={onReject}
      onExecute={onExecute}
      address={address}
    />
    <TransactionHistory address={address} />
  </>
);

export default SafeHome;
