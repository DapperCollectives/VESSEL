import { Link } from "react-router-dom";
import React from "react";
import Svg from "library/Svg";
import { parseIdentifier } from "utils";

function SafeOverview({ allBalance, allNFTs }) {
  const tokensWithPositiveBalance = allBalance
    ? Object.entries(allBalance)
        .map(([key, value]) => ({ type: key, balance: Number(value) }))
        .filter((token) => token.balance > 0)
        .slice(0, 3)
    : [];

  const collectionsForDisplay = allNFTs
    ? Object.entries(allNFTs)
        .map(([key, value]) => {
          const { contractName } = parseIdentifier(key);
          return {
            contractName,
            count: value.length,
          };
        })
        .slice(0, 4)
    : [];
  const emptyNftBlocks = new Array(4 - collectionsForDisplay.length).fill(0);
  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h2>Safe Overview</h2>
      </div>
      <div className="column p-0 mt-4 mb-5 is-flex is-full">
        <div
          className="is-flex is-flex-direction-column flex-1 rounded-sm has-background-primary-purple has-shadow has-text-white p-5 mr-6"
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
                <Link to={(location) => `${location.pathname}/tokens`}>
                  <strong className="has-text-white link">View All</strong>
                </Link>
              )}
            </div>
            {!tokensWithPositiveBalance.length && (
              <div className="p-3 mb-1">
                <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                  <p className="has-text-white ">You don't have any tokens</p>
                  <button className="button column is-half mt-2 has-purple-background-hover-animation has-text-purple">
                    Deposit Tokens
                  </button>
                </div>
              </div>
            )}

            {!!tokensWithPositiveBalance.length && (
              <div className="column is-full p-0 mb-2 is-flex is-flex-direction-row is-justify-content-flex-start">
                {tokensWithPositiveBalance.map(({ type, balance }) => (
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
          className="is-flex is-flex-direction-column flex-1 rounded-sm has-background-purple has-shadow p-5"
          style={{ minWidth: 375 }}
        >
          <div className="is-flex is-flex-direction-row is-justify-content-space-between mb-5">
            <label>NFTs</label>
            {!!collectionsForDisplay.length && (
              <Link to={(location) => `${location.pathname}/NFTs`}>
                <strong className="link">View All</strong>
              </Link>
            )}
          </div>
          {!collectionsForDisplay.length && (
            <div className="p-3 mb-1">
              <div className="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                <p>You don't have any NFTs</p>
                <button className="button column is-half mt-2 is-primary">
                  Deposit NFTs
                </button>
              </div>
            </div>
          )}
          {!!collectionsForDisplay.length && (
            <div className="columns mt-1 is-multiline is-variable is-1">
              {collectionsForDisplay.map(({ contractName, count }) => (
                <div className="column is-half py-1" key={contractName}>
                  <p className="has-background-tertiary-purple rounded-sm p-3 is-flex is-flex-direction-row is-justify-content-space-between">
                    <span className="flex-3 has-text-truncate">
                      {contractName}
                    </span>
                    <span className="flex-1 has-text-right has-text-highlight">
                      <strong>{count}</strong>
                    </span>
                  </p>
                </div>
              ))}
              {emptyNftBlocks.map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="column is-half rounded-sm py-1"
                >
                  <p
                    className="has-background-tertiary-purple rounded-sm p-3"
                    style={{ height: "45px" }}
                  ></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SafeOverview;
