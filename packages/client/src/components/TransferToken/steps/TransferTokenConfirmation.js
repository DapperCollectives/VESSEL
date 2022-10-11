import React from 'react';
import TransactionDetails from '../components/TransactionDetails';

const TransferTokenConfirmation = () => (
  <>
    <TransactionDetails />
    <p className="mt-2 px-5 has-text-grey">
      To complete this action, you will have to confirm it with your connected
      wallet on the next step.
    </p>
  </>
);

export default TransferTokenConfirmation;
