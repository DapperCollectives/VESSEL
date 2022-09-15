import React from "react";
import { NavLink } from "react-router-dom";
import { WalletPrompt } from "../components";
import Svg from "library/Svg";
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
        We’ll get you onboarded after we import your data
      </p>
      <div className="is-flex">
        <NavLink className="has-text-black" to="/load-safe">
          <button className="button is-border  flex-1 mr-2">Load safe</button>
        </NavLink>
        <NavLink to="/create-safe">
          <button className="button is-primary flex-1 with-icon">
            Create new safe <Svg name="Plus" />
          </button>
        </NavLink>
      </div>
    </div>
  </section>
);

function Home({ web3 }) {
  const loggedIn = web3?.user?.loggedIn;
  return loggedIn ? <SafeLinks /> : <WalletPrompt />;
}

export default Web3Consumer(Home);
