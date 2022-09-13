import { Link } from "react-router-dom";
import React from "react";
import Svg from "library/Svg";

function SafeOverview({ allBalance }) {
  const balanceClasses = [
    "is-flex is-flex-direction-column flex-1",
    "rounded-sm has-background-primary-purple has-shadow has-text-white",
    "p-5 mr-6",
  ];

  let tokensWithPositiveBalance = allBalance
    ? Object.entries(allBalance)
        .map((entry) => ({ type: entry[0], balance: Number(entry[1]) }))
        .filter((token) => token.balance > 0)
    : [];
  if (tokensWithPositiveBalance.length > 3)
    tokensWithPositiveBalance = tokensWithPositiveBalance.slice(0, 3);

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h2>Safe Overview</h2>
      </div>
      <div className="column p-0 mt-4 mb-5 is-flex is-full">
        <div
          className={balanceClasses.join(" ")}
          style={{
            overflow: "hidden",
            minHeight: 200,
            minWidth: 375,
            position: "relative",
          }}
        >
          <Svg
            name="LogoV"
            style={{
              position: "absolute",
              top: "0px",
              right: "-30px",
              zIndex: 0,
            }}
          />
          <div style={{ zIndex: 1 }}>
            <div className="column is-full p-0 mb-5 is-flex is-flex-direction-row is-justify-content-space-between">
              <label>Tokens</label>
              {!!tokensWithPositiveBalance.length && (
                <Link to={(location) => `${location.pathname}/assets`}>
                  <strong className="has-text-white">View All</strong>
                </Link>
              )}
            </div>
            {!tokensWithPositiveBalance.length ? (
              <div className="p-3 mb-1">
                <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                  <p className="has-text-white ">You don't have any tokens</p>
                  <button className="button column is-half mt-2 has-purple-background-hover-animation has-text-purple">
                    Deposit Tokens
                  </button>
                </div>
              </div>
            ) : (
              <div className="column is-full p-0 mb-2 is-flex is-flex-direction-row is-justify-content-flex-start">
                {!!tokensWithPositiveBalance.length &&
                  tokensWithPositiveBalance.map(({ type, balance }) => (
                    <div
                      key={type}
                      className="has-background-secondary-purple rounded-sm p-3 m-1"
                      style={{ flex: "2 1 auto", maxWidth: "50%" }}
                    >
                      <div className="is-flex is-flex-direction-row is-justify-content-flex-start mb-5">
                        <Svg name={type} />
                        <label className="ml-2 pt-.5 has-text-black">
                          {type}
                        </label>
                      </div>
                      <h2 className="title is-5 has-text-white has-text-weight-normal has-text-heighlight">
                        {balance.toLocaleString()}
                      </h2>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div
          className="rounded-sm border-light has-shadow p-5 is-flex"
          style={{ minWidth: 375 }}
        ></div>
      </div>
    </>
  );
}

export default SafeOverview;
