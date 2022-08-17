import { useState, useContext, useEffect } from "react";
import { Web3Context } from "contexts/Web3";
import { COIN_TYPES } from "constants/enums";
const TestToolBox = ({ address }) => {
  const [showToolBox, setShowToolBox] = useState(false);
  const [userFUSDBalance, setUserFUSDBalance] = useState(0);
  const [userFlowBalance, setUserFlowBalance] = useState(0);
  const web3 = useContext(Web3Context);
  const {
    injectedProvider,
    initDepositTokensToTreasury,
    sendNFTToTreasury,
    sendCollectionToTreasury,
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
  const onDepositCollection = async () => {
    const latestBlock = await injectedProvider
      .send([injectedProvider.getBlock(true)])
      .then(injectedProvider.decode);

    const { height, id } = latestBlock;
    const collectionIdHex = Buffer.from(
      `A.${address.replace("0x", "")}.ExampleNFT.Collection`
    ).toString("hex");

    const message = `${collectionIdHex}${id}`;
    const messageHex = Buffer.from(message).toString("hex");

    let sigResponse = await injectedProvider
      .currentUser()
      .signUserMessage(messageHex);
    const sigMessage =
      sigResponse[0]?.signature?.signature ?? sigResponse[0]?.signature;
    const keyIds = [sigResponse[0]?.keyId];
    const signatures = [sigMessage];

    await sendCollectionToTreasury(
      address,
      message,
      keyIds,
      signatures,
      height
    );
  };
  const onDepositNFT = async () => {
    await sendNFTToTreasury(address, 0);
    await getTreasuryCollections(address);
  };
  const updateUserBalance = async () => {
    try {
      const fusdBalance = await getUserFUSDBalance(user.addr);
      setUserFUSDBalance(fusdBalance);
    } catch (err) {
      console.log(`Failed to get FUSD balance, error: ${err}`)
    }
    const flowBalance = await getUserFlowBalance(user.addr);
    setUserFlowBalance(flowBalance);
  };
  useEffect(() => {
    updateUserBalance();
  }, []);
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
                    onClick={onDepositCollection}
                  >
                    Deposit Collection
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
