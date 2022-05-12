import React from "react";

function IntentList({ intents = [] }) {
  const IntentionComponents = [];
  if (!intents.length) {
    IntentionComponents.push(
      <div
        className="column is-full p-0 is-flex is-justify-content-center is-align-items-center has-text-grey"
        style={{ minHeight: 175 }}
        key="no-transactions"
      >
        No pending transactions
      </div>
    );
  }

  return (
    <div className="column p-0 mt-4 mb-5 is-flex is-full border-light has-shadow rounded-sm">
      {IntentionComponents}
    </div>
  );
}

export default IntentList;
