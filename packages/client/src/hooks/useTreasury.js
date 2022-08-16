import { useEffect, useReducer } from "react";
import { mutate, query, tx, config } from "@onflow/fcl";
import { syncSafeOwnersWithSigners, getVaultId } from "../utils";
import { COIN_TYPE_TO_META } from "constants/maps";
import reducer, { INITIAL_STATE } from "../reducers/treasuries";
import {
  CREATE_TREASURY_LIMIT,
  EXECUTE_ACTION_LIMIT,
  REGULAR_LIMIT,
  SIGNED_LIMIT,
  SIGNER_APPROVE_LIMIT,
  UPDATE_SIGNER_LIMIT,
  createSignature,
} from "../contexts/Web3";
import {
  GET_SIGNERS,
  GET_THRESHOLD,
  INITIALIZE_TREASURY,
  SEND_TOKENS_TO_TREASURY,
  GET_PROPOSED_ACTIONS,
  SIGNER_APPROVE,
  GET_SIGNERS_FOR_ACTION,
  EXECUTE_ACTION,
  GET_TREASURY_IDENTIFIERS,
  UPDATE_THRESHOLD,
  ADD_SIGNER,
  UPDATE_SIGNER,
  REMOVE_SIGNER,
  GET_VAULT_BALANCE,
  PROPOSE_TRANSFER,
  ADD_VAULT,
  ADD_COLLECTION,
  GET_USER_FUSD_BALANCE,
  GET_USER_FLOW_BALANCE,
} from "../flow";
import { COIN_TYPES } from "constants/enums";

const storageKey = "vessel-treasuries";

const doQuery = async (cadence, address) => {
  const queryResp = await query({
    cadence,
    args: (arg, t) => [arg(address, t.Address)],
  }).catch(console.error);

  return queryResp;
};

const doCreateTreasury = async (signerAddresses, threshold) => {
  return await mutate({
    cadence: INITIALIZE_TREASURY,
    args: (arg, t) => [
      arg(signerAddresses, t.Array(t.Address)),
      arg(threshold, t.UInt64),
    ],
    limit: CREATE_TREASURY_LIMIT,
  });
};

const doSendTokensToTreasury = async (treasuryAddr, amount, coinType) => {
  const vaultPath = COIN_TYPE_TO_META[coinType].storageVaultPath;
  return await mutate({
    cadence: SEND_TOKENS_TO_TREASURY,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(amount, t.UFix64),
      arg(vaultPath, t.Path),
    ],
    limit: REGULAR_LIMIT,
  });
};

const doProposeTransfer = async (
  treasuryAddr,
  recipientAddr,
  amount,
  coinType
) => {
  const uFixAmount = String(parseFloat(amount).toFixed(8));
  const identifiers = await doQuery(GET_TREASURY_IDENTIFIERS, treasuryAddr);
  const recepientVault = getVaultId(identifiers, coinType);
  const intent = `Transfer ${uFixAmount} ${recepientVault} tokens from the treasury to ${recipientAddr}`;

  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: PROPOSE_TRANSFER,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(recipientAddr, t.Address),
      arg(amount, t.UFix64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
      arg(COIN_TYPE_TO_META[coinType].publicReceiverPath, t.Path),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doSignApprove = async (
  treasuryAddr,
  actionUUID,
  message,
  keyIds,
  signatures,
  signatureBlock
) => {
  return await mutate({
    cadence: SIGNER_APPROVE,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(actionUUID, t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(signatureBlock, t.UInt64),
    ],
    limit: SIGNER_APPROVE_LIMIT,
  });
};

const doExecuteAction = async (treasuryAddr, actionUUID) => {
  const { message, keyIds, signatures, height } = await createSignature(
    actionUUID.toString()
  );

  return await mutate({
    cadence: EXECUTE_ACTION,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(actionUUID, t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: EXECUTE_ACTION_LIMIT,
  });
};

const doUpdateThreshold = async (treasuryAddr, newThreshold) => {
  const intent = `Update the threshold of signers to ${newThreshold}.`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: UPDATE_THRESHOLD,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(newThreshold, t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doProposeAddSigner = async (treasuryAddr, newSignerAddress) => {
  const intent = `Add account ${newSignerAddress} as a signer.`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: ADD_SIGNER,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(newSignerAddress, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doUpdateSigner = async (oldSignerAddress, newSignerAddress) => {
  return await mutate({
    cadence: UPDATE_SIGNER,
    args: (arg, t) => [
      arg(oldSignerAddress, t.Address),
      arg(newSignerAddress, t.Address),
    ],
    limit: UPDATE_SIGNER_LIMIT,
  });
};

const doProposeRemoveSigner = async (
  treasuryAddr,
  signerToBeRemovedAddress
) => {
  const intent = `Remove ${signerToBeRemovedAddress} as a signer.`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: REMOVE_SIGNER,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(signerToBeRemovedAddress, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doProposeAddVault = async (treasuryAddr, contractName) => {
  const contractAddress = await config().get(`0x${contractName}`);

  const intent = `A.${contractAddress.replace("0x", "")}.${contractName}.Vault`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: ADD_VAULT(contractName),
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64)
    ],
    limit: SIGNED_LIMIT,
  });
};

const doProposeAddCollection = async (treasuryAddr, contractName, contractAddress) => {
  const intent = `A.${contractAddress.replace("0x", "")}.${contractName}.Collection`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: ADD_COLLECTION(contractName, contractAddress),
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64)
    ],
    limit: SIGNED_LIMIT,
  });
};

const getSigners = async (address) => {
  return await doQuery(GET_SIGNERS, address);
};

const getThreshold = async (address) => {
  return await doQuery(GET_THRESHOLD, address);
};

const getProposedActions = async (address) => {
  return await doQuery(GET_PROPOSED_ACTIONS, address);
};

const getSignersForAction = async (address, actionUUID) => {
  return await query({
    cadence: GET_SIGNERS_FOR_ACTION,
    args: (arg, t) => [arg(address, t.Address), arg(actionUUID, t.UInt64)],
  }).catch(console.error);
};

const getVaultBalance = async (address, coinType = COIN_TYPES.FLOW) => {
  const identifiers = await doQuery(GET_TREASURY_IDENTIFIERS, address);
  const vaultId = getVaultId(identifiers, coinType);
  if (vaultId) {
    return await query({
      cadence: GET_VAULT_BALANCE,
      args: (arg, t) => [arg(address, t.Address), arg(vaultId, t.String)],
    }).catch(console.error);
  }

  return 0;
};
const getAllVaultBalance = async (address) => {
  const allBalance = Object.assign({}, COIN_TYPES);
  for await (const coinType of Object.keys(COIN_TYPES)) {
    const balance = await getVaultBalance(address, coinType);
    allBalance[coinType] = balance;
  }
  return allBalance;
};
export default function useTreasury(treasuryAddr) {
  const [state, dispatch] = useReducer(reducer, [], (initial) => ({
    ...initial,
    ...INITIAL_STATE,
    treasuries: JSON.parse(localStorage.getItem(storageKey)) || {},
  }));

  const refreshTreasury = async () => {
    const signers = await getSigners(treasuryAddr);
    if (!signers) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }
    const threshold = await getThreshold(treasuryAddr);

    dispatch({
      type: "SET_TREASURY",
      payload: {
        [treasuryAddr]: {
          address: treasuryAddr,
          signers,
          threshold,
        },
      },
    });

    const allBalance = await getAllVaultBalance(treasuryAddr);

    if (allBalance) {
      dispatch({
        type: "SET_BALANCE",
        payload: {
          [treasuryAddr]: allBalance,
        },
      });
    }

    const proposedActions = [];
    const proposedActionsResp = await getProposedActions(treasuryAddr);

    for (const action of Object.keys(proposedActionsResp ?? {})) {
      const uuid = parseInt(action, 10);
      const verifiedSigners = await getSignersForAction(
        treasuryAddr,
        parseInt(action, 10)
      );
      proposedActions.push({
        uuid,
        intent: proposedActionsResp[action],
        verifiedSigners,
      });
    }

    dispatch({
      type: "SET_ACTIONS",
      payload: {
        [treasuryAddr]: proposedActions,
      },
    });
  };

  const updateOwnerList = async (treasuryAddr) => {
    const signers = await getSigners(treasuryAddr);
    const safeOwners = state.treasuries[treasuryAddr].safeOwners;
    const updatedSafeOwners = syncSafeOwnersWithSigners(signers, safeOwners);
    dispatch({
      type: "SET_TREASURY",
      payload: {
        [treasuryAddr]: {
          safeOwners: updatedSafeOwners,
        },
      },
    });
  };

  useEffect(() => {
    if (!treasuryAddr) {
      if (state.loadingTreasuries) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
      return;
    }
    const checkTreasuries = async () => {
      refreshTreasury();
    };
    checkTreasuries();
    // TODO: rewrite so doesnt trigger exhaustive deps warning
    // eslint-disable-next-line
  }, [state.loadingTreasuries, treasuryAddr]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state.treasuries));
  }, [state.treasuries]);

  const createTreasury = async (treasuryData) => {
    dispatch({ type: "SET_CREATING_TREASURY", payload: true });
    const { safeOwners, threshold } = treasuryData;
    const signerAddresses = safeOwners.map((is) => is.address);
    const creatorAddr = signerAddresses[0];
    const res = await doCreateTreasury(signerAddresses, threshold);
    if (res) {
      dispatch({ type: "SUBMITTED_TREASURY_TRANSACTION" });
    }
    await tx(res).onceSealed();
    setTreasury(creatorAddr, treasuryData);
    dispatch({ type: "TREASURY_TRANSACTION_SUCCESS" });
    return res;
  };
  const cancelCreatingTreasury = () => {
    dispatch({ type: "SET_CREATING_TREASURY", payload: false });
  };
  const setTreasury = (treasuryAddr, treasuryData) => {
    dispatch({
      type: "SET_TREASURY",
      payload: {
        [treasuryAddr]: treasuryData,
      },
    });
  };

  const fetchTreasury = async (treasuryAddr) => {
    const signers = await getSigners(treasuryAddr);
    if (signers) {
      const threshold = await getThreshold(treasuryAddr);
      return { threshold, signers };
    }

    return null;
  };

  //FOR TESTING UTILS ONLY, calling this method deposits tokens to treasury
  //should only be used for testing
  const initDepositTokensToTreasury = async () => {
    const flowRes = await doSendTokensToTreasury(
      treasuryAddr,
      String(parseFloat(10).toFixed(8)),
      COIN_TYPES.FLOW
    );
    const fusdRes = await doSendTokensToTreasury(
      treasuryAddr,
      String(parseFloat(10).toFixed(8)),
      COIN_TYPES.FUSD
    );
    await tx(flowRes).onceSealed();
    await tx(fusdRes).onceSealed();
    await refreshTreasury();
  };

  const proposeTransfer = async (recipientAddr, amount, coinType) => {
    const res = await doProposeTransfer(
      treasuryAddr,
      recipientAddr,
      parseFloat(amount).toFixed(8),
      coinType
    );
    await tx(res).onceSealed();
  };

  const signerApprove = async (
    actionUUID,
    message,
    keyIds,
    signatures,
    signatureBlock
  ) => {
    const res = await doSignApprove(
      treasuryAddr,
      actionUUID,
      message,
      keyIds,
      signatures,
      signatureBlock
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const executeAction = async (actionUUID) => {
    const res = await doExecuteAction(treasuryAddr, actionUUID);
    await tx(res).onceSealed();
    await refreshTreasury();
    await updateOwnerList(treasuryAddr);
  };

  const updateThreshold = async (newThreshold) => {
    const res = await doUpdateThreshold(treasuryAddr, newThreshold);
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeAddSigner = async (newSignerAddress) => {
    const res = await doProposeAddSigner(treasuryAddr, newSignerAddress);
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const updateSigner = async (oldSignerAddress, newSignerAddress) => {
    const res = await doUpdateSigner(oldSignerAddress, newSignerAddress);
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeRemoveSigner = async (signerToBeRemovedAddress) => {
    const res = await doProposeRemoveSigner(
      treasuryAddr,
      signerToBeRemovedAddress
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeAddVault = async (coinType) => {
    try {
      const contractName = COIN_TYPE_TO_META[coinType].contractName;
      const res = await doProposeAddVault(treasuryAddr, contractName);
      await tx(res).onceSealed();
      await refreshTreasury();
    } catch (error) {
      console.error(error);
    }
  };

  const proposeAddCollection = async (contractName, contractAddress) => {
    try {
      const res = await doProposeAddCollection(treasuryAddr, contractName, contractAddress);
      await tx(res).onceSealed();
      await refreshTreasury();
    } catch (error) {
      console.error(error);
    }
  };

  const getUserFUSDBalance = async (address) => {
    const balance = await query({
      cadence: GET_USER_FUSD_BALANCE,
      args: (arg, t) => [arg(address, t.Address)],
    }).catch(console.error);
    return balance;
  };
  const getUserFlowBalance = async (address) => {
    const balance = await query({
      cadence: GET_USER_FLOW_BALANCE,
      args: (arg, t) => [arg(address, t.Address)],
    }).catch(console.error);
    return balance;
  };
  return {
    ...state,
    refreshTreasury,
    createTreasury,
    cancelCreatingTreasury,
    fetchTreasury,
    setTreasury,
    initDepositTokensToTreasury,
    proposeTransfer,
    signerApprove,
    executeAction,
    updateThreshold,
    proposeAddSigner,
    updateSigner,
    proposeRemoveSigner,
    getVaultBalance,
    proposeAddVault,
    proposeAddCollection,
    getUserFUSDBalance,
    getUserFlowBalance,
  };
}
