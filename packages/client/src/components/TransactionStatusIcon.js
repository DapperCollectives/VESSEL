import React from "react";

const STATUS_TO_BACKGROUND_COLOR = {
  confirmed: "#18AA01",
  pending: "#FF8A00",
};

function TransactionStatusIcon({ status }) {
  const style = {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: STATUS_TO_BACKGROUND_COLOR[status.toLowerCase()],
  };

  return <div className="is-inline-flex" style={style} />;
}

export default TransactionStatusIcon;
