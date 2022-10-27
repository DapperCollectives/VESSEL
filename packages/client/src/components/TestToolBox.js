import { useContext, useEffect, useState } from 'react';
import { Web3Context } from 'contexts/Web3';
import { useAccount } from 'hooks';
import { COIN_TYPES } from 'constants/enums';
import { COIN_TYPE_TO_META } from 'constants/maps';
import { formatAddress } from 'utils';

const TestToolBox = ({ address }) => {
  const [showToolBox, setShowToolBox] = useState(false);
  const [userBalances, setUserBalances] = useState([]);
  const web3 = useContext(Web3Context);
  const { getUserBalances, initDepositTokensToTreasury } = useAccount();
  const { sendNFTToTreasury, getTreasuryCollections, balances, user } = web3;

  const treasuryBalances = balances?.[address];
  const onDeposit = async () => {
    await initDepositTokensToTreasury(address);
  };

  const onDepositNFT = async () => {
    await sendNFTToTreasury(address, 3);
    await getTreasuryCollections(address);
  };

  const updateUserBalance = async () => {
    try {
      const newUserBalances = await getUserBalances(formatAddress(user.addr));
      setUserBalances(newUserBalances);
    } catch (err) {
      console.log(`Failed to get coin balances, error: ${err}`);
    }
  };

  useEffect(() => {
    updateUserBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'absolute', left: '20%', zIndex: 10000 }}>
      <div className="is-flex is-flex-direction-column">
        <button
          style={{ border: 'none' }}
          className="has-background-info has-text-black p-1"
          onClick={() => {
            setShowToolBox((prevState) => !prevState);
          }}
        >
          {process.env.REACT_APP_FLOW_ENV} test utils
        </button>
        {showToolBox && (
          <div
            className="has-text-black p-1 is-flex is-flex-direction-row has-background-info  p-3"
            style={{ opacity: 1 }}
          >
            <div className="mr-5">
              <label>
                <strong>Balances</strong>
                <button
                  className="has-background-info ml-2"
                  onClick={updateUserBalance}
                >
                  refresh
                </button>
              </label>
              <ul>
                <li>
                  <span>Account:</span>
                  {userBalances && !!userBalances.length && (
                    <ul className="ml-3">
                      {userBalances.map((coin) => (
                        <li key={COIN_TYPE_TO_META[coin.coinType].displayName}>
                          {`${COIN_TYPE_TO_META[coin.coinType].displayName}: ${
                            coin.balance
                          }`}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <span>Treasury:</span>
                  <ul className="ml-3">
                    {treasuryBalances?.[COIN_TYPES.FLOW] && (
                      <li>
                        Flow:
                        {treasuryBalances[COIN_TYPES.FLOW]}
                      </li>
                    )}
                    {treasuryBalances?.[COIN_TYPES.FUSD] && (
                      <li>
                        FUSD:
                        {treasuryBalances[COIN_TYPES.FUSD]}
                      </li>
                    )}
                    {treasuryBalances?.[COIN_TYPES.USDC] && (
                      <li>
                        USDC:
                        {treasuryBalances[COIN_TYPES.USDC]}
                      </li>
                    )}
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
