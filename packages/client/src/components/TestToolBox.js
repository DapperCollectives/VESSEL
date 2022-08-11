import { useState, useContext, useEffect } from "react";
import { Web3Context } from "contexts/Web3";
import { COIN_TYPES } from "constants/enums";
const TestToolBox = ({ address }) => {
  const [showToolBox, setShowToolBox] = useState(false);
  const [userFUSDBalance, setUserFUSDBalance] = useState(0);
  const [userFlowBalance, setUserFlowBalance] = useState(0);
  const web3 = useContext(Web3Context);
  const {
    initDepositTokensToTreasury,
    sendNFTToTreasury,
    getTreasuryCollections,
    getUserFUSDBalance,
    getUserFlowBalance,
    balances,
    user,
  } = web3;

  const treasuryBalances = balances[address];
  const onDeposit = async () => {
    await initDepositTokensToTreasury();
  };

  const onDepositNFT = async () => {
    await sendNFTToTreasury(address, 0);
    await getTreasuryCollections(address);
  };
  const updateUserBalance = async () => {
    const fusdBalance = await getUserFUSDBalance(user.addr);
    const flowBalance = await getUserFlowBalance(user.addr);

    setUserFUSDBalance(fusdBalance);
    setUserFlowBalance(flowBalance);
  };

  useEffect(() => {
    updateUserBalance();
  });

  return (
    <div style={{ position: "absolute", left: "20%", zIndex: 10000 }}>
      <div className="is-flex is-flex-direction-column">
        <a
          className="has-background-warning has-text-black p-1"
          onClick={() => {
            setShowToolBox((prevState) => !prevState);
          }}
        >
          {process.env.REACT_APP_FLOW_ENV} test utils
        </a>
        {showToolBox && (
          <div
            className="has-text-black p-1 is-flex is-flex-direction-row has-background-warning  p-3"
            style={{ opacity: 1 }}
          >
            <div className="mr-5">
              <label>
                <strong>Balances</strong>
                <a className="is-underlined ml-2" onClick={updateUserBalance}>
                  refresh
                </a>
              </label>
              <ul>
                <li>
                  <span>Account:</span>
                  <ul className="ml-3">
                    <li>Flow: {userFlowBalance}</li>
                    <li>FUSD: {userFUSDBalance}</li>
                  </ul>
                </li>
                <li>
                  <span>Treasury:</span>
                  <ul className="ml-3">
                    <li>Flow: {treasuryBalances[COIN_TYPES.FLOW]}</li>
                    <li>FUSD: {treasuryBalances[COIN_TYPES.FUSD]}</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div>
              <label>
                <strong>Actions</strong>
              </label>
              <ul>
                <li>
                  <span className="is-underlined pointer" onClick={onDeposit}>
                    Deposit Tokens
                  </span>
                </li>
                <li>
                  <span
                    className="is-underlined pointer"
                    onClick={onDepositNFT}
                  >
                    Deposit NFT
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestToolBox;
