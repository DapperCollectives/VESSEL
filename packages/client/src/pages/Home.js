import React from "react";
import { isEmpty } from "lodash";
import { NavLink } from "react-router-dom";
import { WalletPrompt } from "../components";
import { Plus } from "../components/Svg";
import { Web3Consumer } from "../contexts/Web3";

const SafeLinks = () => (
  <section className="section screen-height is-flex is-align-items-center">
    <div className="container is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <div
        className="safe-img mb-6"
        style={{ height: 220, width: 280, background: "#f6f6f6" }}
      />
      <h1 className="title has-text-black is-size-3">
        Create or load a Safe to get started
      </h1>
      <p className="subtitle has-text-grey">
        We’ll get you onboarded after you we import your data
      </p>
      <div className="is-flex">
        <NavLink className="has-text-black" to="/load-safe">
          <button className="button py-4 px-6 pointer flex-1 mr-2">
            Load safe
          </button>
        </NavLink>
        <NavLink to="/create-safe">
          <button className="button py-4 px-6 pointer flex-1 is-link">
            <Plus className="mr-2" /> Create new safe
          </button>
        </NavLink>
      </div>
    </div>
  </section>
);

function Home({ web3 }) {
  const { loadingSafes, safes, user } = web3;
  let SafeCpt = null;
  console.log(loadingSafes, safes);
  const loggedIn = user?.loggedIn;
  if (!loadingSafes && isEmpty(safes) && loggedIn) {
    SafeCpt = <SafeLinks />;
  } else if (!loggedIn) {
    SafeCpt = <WalletPrompt />;
  }

  return SafeCpt;
}

export default Web3Consumer(Home);
