import React from "react";
import { Person } from "./Svg";
import { useClipboard } from "../hooks";

function SafeContacts({ safeOwners = [] }) {
  const clipboard = useClipboard();

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Saved addresses</h4>
      </div>
      <div className="column p-0 mt-4 is-flex is-flex-direction-column is-full rounded-sm border-light has-shadow">
        {safeOwners.map((so, i) => (
          <div
            className="is-flex is-align-items-center is-justify-content-space-between column is-full p-5 border-light-bottom"
            key={i}
          >
            <div className="mr-5">
              <Person />
            </div>
            <div className="px-2 mr-6" style={{ minWidth: 120 }}>
              {so.name ?? `Signer #${i + 1}`}
            </div>
            <div className="flex-2">{so.address}</div>
            <div className="is-underlined">
              <span className="mr-5">Edit</span>
              <span
                className="mr-5 pointer"
                onClick={() => clipboard.copy(so.address)}
              >
                {clipboard.textJustCopied === so.address
                  ? "Copied"
                  : "Copy Address"}
              </span>
              <span>Send</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SafeContacts;
