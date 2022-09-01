import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import Safes from "./Safes";
import WalletConnect from "./WalletConnect";

const Navigation = (props) => (
  <aside className="menu flex-1 is-flex is-flex-direction-column is-justify-content-space-between">
    <ul className="menu-list mb-6">
      <Safes {...props} />
    </ul>
    <ul className="menu-list is-size-6">
      <li>
        <WalletConnect />
      </li>
      <li className="py-4 px-4 border-light-top">
        <NavLink to="/faq">FAQ</NavLink>
      </li>
      <li className="py-4 px-4 border-light-top">
        <NavLink to="/terms">Terms of Service</NavLink>
      </li>
      <li className="py-4 px-4 mb-2 border-light-top">
        <NavLink to="/faq">Privacy Policy</NavLink>
      </li>
    </ul>
  </aside>
);

export default withRouter((props) => <Navigation {...props} />);
