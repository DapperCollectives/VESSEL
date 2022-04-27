import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { shortenAddr } from "../utils";
import {
  SafeHome,
  SafeTransactions,
  SafeAssets,
  SafeContacts,
  SafeSettings,
} from "../components";
import { ArrowDown, ArrowUp } from "../components/Svg";
import { Web3Consumer } from "../contexts/Web3";

function Safe({ web3 }) {
  const params = useParams();
  const { address, tab } = params;

  const safeData = web3?.treasuries?.[address];
  if (!safeData) {
    return (
      <section className="section screen-height is-flex is-align-items-center">
        <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
          Couldn't find this safe's data...
        </div>
      </section>
    );
  }

  const currentTab = tab ?? "home";
  const buttons = ["home", "transactions", "assets", "contacts", "settings"];
  const buttonClasses = [
    "button rounded-lg border-none",
    "is-capitalized",
    "mr-2",
  ];

  const ButtonCpts = buttons.map((btn, i) => {
    const classes = [
      ...buttonClasses,
      currentTab === btn
        ? "has-background-black has-text-white"
        : "has-text-grey",
    ];
    const baseUrl = `/safe/${address}`;
    const to = btn === "home" ? baseUrl : `${baseUrl}/${btn}`;
    return (
      <NavLink to={to}>
        <button className={classes.join(" ")} key={i}>
          {btn}
        </button>
      </NavLink>
    );
  });

  const tabMap = {
    home: <SafeHome key="safe-home" />,
    transactions: <SafeTransactions key="safe-transactions" />,
    assets: <SafeAssets key="safe-assets" />,
    contacts: (
      <SafeContacts safeOwners={safeData?.safeOwners} key="safe-contacts" />
    ),
    settings: (
      <SafeSettings address={address} {...safeData} key="safe-settings" />
    ),
  };

  const BodyComponent = tabMap[currentTab];

  return (
    <section className="section is-flex is-flex-direction-column has-text-black">
      <div className="column is-full p-0 is-flex is-flex-direction-column mb-5">
        <h2 className="is-size-4 mb-2">{safeData.name}</h2>
        <p className="has-text-grey">Safe address {shortenAddr(address)}</p>
      </div>
      <div className="column is-full p-0 is-flex is-align-items-center">
        <div className="is-flex">{ButtonCpts}</div>
        <div className="is-flex flex-1 is-justify-content-end">
          <div className="w-auto">
            <button className="button py-4 px-5 pointer mr-2">
              Receive <ArrowDown className="ml-2" />
            </button>
            <button className="button py-4 px-5 pointer is-link">
              Send <ArrowUp className="ml-2 has-text-white" />
            </button>
          </div>
        </div>
      </div>
      {BodyComponent}
    </section>
  );
}

export default Web3Consumer(Safe);
