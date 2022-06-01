import React from "react";

const BalanceBar = ({ progress = 0 }) => {
  return (
    <div
      className="is-flex is-justify-content-space-between column p-0 is-full"
      style={{ position: "relative" }}
    >
      <div
        className="column is-full p-0 rounded-sm has-background-white"
        style={{
          height: 8,
          opacity: 0.3,
        }}
      />
      {progress > 0 && (
        <div
          className="rounded-sm has-background-white"
          style={{
            height: 8,
            opacity: 0.3,
            position: "absolute",
            top: 0,
            left: 0,
            width: `${progress}%`,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

function SafeOverview({ balance }) {
  const balanceClasses = [
    "is-flex is-flex-direction-column flex-1",
    "rounded-sm has-safe-gradient has-shadow has-text-white",
    "p-5 mr-6",
  ];

  const moneyClasses = [
    "is-flex is-flex-direction-column is-justify-content-space-between flex-1",
  ];

  return (
    <>
      <div className="column p-0 mt-5 is-flex is-full">
        <h4 className="is-size-5">Safe Overview</h4>
      </div>
      <div className="column p-0 mt-4 mb-5 is-flex is-full">
        <div className={balanceClasses.join(" ")}>
          <div className="column is-full p-0 is-flex is-justify-content-space-between mb-2">
            <div>Available</div>
            <div>FLOW</div>
          </div>
          <div className="column is-full p-0 mb-2">
            <h2 className="is-size-4">{balance}</h2>
          </div>
          <BalanceBar progress={100} />
          <div className="column is-full p-0 is-flex is-justify-content-space-between mt-2 is-size-6">
            {balance > 0 ? (
              <div>100% FLOW</div>
            ) : (
              <>
                <div>Your safe is empty</div>
                <div className="is-underlined">Transfer assets</div>
              </>
            )}
          </div>
        </div>
        <div
          className="rounded-sm border-light has-shadow p-5 is-flex"
          style={{ minWidth: 375 }}
        >
          <div
            className={[...moneyClasses, "border-light-right pr-5"].join(" ")}
          >
            <div>
              <div>Money in</div>
              <div className="has-text-grey is-size-6 mt-1">
                Over the last 30-days
              </div>
            </div>
            <div>
              <div className="is-size-4">$0.00</div>
            </div>
          </div>
          <div className={[...moneyClasses, "pl-5"].join(" ")}>
            <div>
              <div>Money out</div>
              <div className="has-text-grey is-size-6 mt-1">
                Over the last 30-days
              </div>
            </div>
            <div>
              <div className="is-size-4">$0.00</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SafeOverview;
