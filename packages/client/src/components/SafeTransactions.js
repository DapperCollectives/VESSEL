import React from 'react';
import TransactionTable from './TransactionTable';

function SafeTransactions({ address, emptyComponent, className }) {
  return (
    <TransactionTable
      address={address}
      emptyComponent={emptyComponent}
      className={className}
    />
  );
}

export default SafeTransactions;
