import React from "react";
import { isEmpty } from "lodash";
import { NavLink } from "react-router-dom";
import { Web3Consumer } from "../contexts/Web3";

function Safes(props) {
  const { treasuries } = props.web3;

  if (isEmpty(treasuries)) {
    return (
      <div className="has-background-blue-light has-text-white p-4 rounded-sm is-size-6">
        <h3>
          <b>Setup tips</b>
        </h3>
        <p className="mt-2 has-text-grey-light">
          Create or load your first safe to get started. We’ll pull in your
          information shortly after.
        </p>
      </div>
    );
  }

  return (
    <aside className="menu">
      {treasuries.map((tr, i) => (
        <NavLink to={`/safe/${tr.addr}`}>
          <div className="is-flex has-background-blue-light" key={i}>
            <div
              className="m-2"
              style={{
                minHeight: 60,
                minWidth: 60,
                backgroundImage: `url(data:image/png;base64,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)`,
                backgroundSize: "cover",
              }}
            />
            <div className="flex-1 is-flex is-align-items-center px-2">
              {tr.name}
            </div>
          </div>
        </NavLink>
      ))}
    </aside>
  );
}

export default Web3Consumer(Safes);
