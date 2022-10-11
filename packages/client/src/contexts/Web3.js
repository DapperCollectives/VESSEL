import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useFclUserBalance, useNFTs, useTreasury, useVaults } from '../hooks';
import { CURRENT_USER_SESSION_KEY } from 'constants/constants';
import * as fcl from '@onflow/fcl';
import { Buffer } from 'buffer';
import networks from '../networks';

// create our app context
export const Web3Context = React.createContext({});

// provider Component that wraps the entire app and provides context variables
export default function Web3Provider({
  children,
  network = 'testnet',
  ...props
}) {
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionError, setTransactionError] = useState('');
  const [txId, setTxId] = useState(null);

  const executeTransaction = async (cadence, args, options = {}) => {
    setTransactionInProgress(true);
    setTransactionStatus(-1);

    const transactionId = await fcl
      .mutate({
        cadence,
        args,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: options.limit || 50,
      })
      .catch((e) => {
        setTransactionInProgress(false);
        setTransactionStatus(500);
        setTransactionError(String(e));
      });

    if (transactionId) {
      setTxId(transactionId);
      fcl
        .tx(transactionId)
        .subscribe((res) => setTransactionStatus(res.status));
    }
  };

  const logOut = async () => {
    await fcl.unauthenticate();
  };

  useEffect(() => {
    const { accessApi, walletDiscovery } = networks[network];
    fcl
      .config()
      .put('accessNode.api', accessApi) // connect to Flow
      .put('discovery.wallet', walletDiscovery); // use Blocto wallet

    try {
      const contracts = require('../contracts.json');
      Object.keys(contracts).forEach((contract) => {
        fcl.config().put(contract, contracts[contract]);
      });
    } catch (e) {}
  }, [network]);
  const userBalance = useFclUserBalance(fcl);
  const userSession = window.sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
  const user = {
    ...(userSession ? JSON.parse(userSession) : {}),
    balance: userBalance,
  };
  // if on a safe page, get safe's treasury info
  const match = useRouteMatch({
    path: ['/safe/:address', '/safe/:address/:tab'],
  });
  const treasuryAddr = match?.params?.address;
  const treasuryProps = useTreasury(treasuryAddr);
  const nftProps = useNFTs(treasuryAddr);
  const vaultProps = useVaults(treasuryAddr);

  // for Nextjs Builds, return null until "window" is available
  if (!global.window) {
    return null;
  }

  // use props as a way to pass configuration values
  const providerProps = {
    executeTransaction,
    transaction: {
      id: txId,
      inProgress: transactionInProgress,
      status: transactionStatus,
      errorMessage: transactionError,
    },
    injectedProvider: fcl,
    user,
    address: user.addr,
    logOut,
    ...nftProps,
    ...vaultProps,
    ...treasuryProps,
    ...props,
  };

  return (
    <Web3Context.Provider value={providerProps}>
      {children}
    </Web3Context.Provider>
  );
}

export function Web3Consumer(Component) {
  return function HOC(pageProps) {
    return (
      <Web3Context.Consumer>
        {(web3Values) => <Component web3={web3Values} {...pageProps} />}
      </Web3Context.Consumer>
    );
  };
}

export const createSignature = async (intent, uuid = undefined) => {
  try {
    const latestBlock = await fcl.send([fcl.getBlock(true)]).then(fcl.decode);
    const { height, id } = latestBlock;
    const intentHex = Buffer.from(intent).toString('hex');
    const message = `${uuid || ''}${intentHex}${id}`;
    const messageHex = Buffer.from(message).toString('hex');
    const sigResponse = await fcl.currentUser().signUserMessage(messageHex);
    const { keyId } = sigResponse[0];
    const { signature } = sigResponse[0];
    const keyIds = [keyId];
    const signatures = [signature];
    return {
      message,
      keyIds,
      signatures,
      height,
    };
  } catch (error) {
    console.log('error in creating a signature', error);
  }
};
