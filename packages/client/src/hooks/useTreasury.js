import { useEffect, useReducer } from "react";
import { mutate, query, tx } from "@onflow/fcl";

import reducer, { INITIAL_STATE } from "../reducers/treasuries";
import {
  GET_SIGNERS,
  GET_THRESHOLD,
  INITIALIZE_TREASURY,
  SEND_FLOW_TO_TREASURY,
  PROPOSE_TRANSFER,
  GET_PROPOSED_ACTIONS,
  SIGNER_APPROVE,
  GET_SIGNERS_FOR_ACTION,
  EXECUTE_ACTION,
  GET_TREASURY_IDENTIFIERS,
  UPDATE_THRESHOLD,
  ADD_SIGNER,
  UPDATE_SIGNER,
  GET_VAULT_BALANCE,
} from "../flow";

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
    limit: 80,
  });
};

const doSendFlowToTreasury = async (treasuryAddr, amount) => {
  return await mutate({
    cadence: SEND_FLOW_TO_TREASURY,
    args: (arg, t) => [arg(treasuryAddr, t.Address), arg(amount, t.UFix64)],
    limit: 55,
  });
};

const doProposeTransfer = async (
  treasuryAddr, 
  recipientAddr, 
  amount,
  message,
  keyIds,
  signatures,
  height
) => {
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
    ],
    limit: 300,
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
    limit: 310,
  });
};

const doExecuteAction = async (treasuryAddr, actionUUID) => {
  return await mutate({
    cadence: EXECUTE_ACTION,
    args: (arg, t) => [arg(treasuryAddr, t.Address), arg(actionUUID, t.UInt64)],
    limit: 110,
  });
};

const doUpdateThreshold = async (
  newThreshold,
  message,
  keyIds,
  signatures,
  height
) => {
  return await mutate({
    cadence: UPDATE_THRESHOLD,
    args: (arg, t) => [
      arg(newThreshold, t.UInt64),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64)
    ],
    limit: 300,
  });
};

const doAddSigner = async (
  newSignerAddress,
  message,
  keyIds,
  signatures,
  height
) => {  
  return await mutate({
    cadence: ADD_SIGNER,
    args: (arg, t) => [
      arg(newSignerAddress, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64)
    ],
    limit: 300,
  });
};

const doUpdateSigner = async (oldSignerAddress, newSignerAddress) => {
  return await mutate({
    cadence: UPDATE_SIGNER,
    args: (arg, t) => [
      arg(oldSignerAddress, t.Address),
      arg(newSignerAddress, t.Address),
    ],
    limit: 110,
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

const getVaultBalance = async (address) => {
  const identifiers = await doQuery(GET_TREASURY_IDENTIFIERS, address);
  const vaultId = identifiers?.[0]?.[0];
  if (vaultId) {
    return await query({
      cadence: GET_VAULT_BALANCE,
      args: (arg, t) => [arg(address, t.Address), arg(vaultId, t.String)],
    }).catch(console.error);
  }

  return 0;
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

    const balance = await getVaultBalance(treasuryAddr);
    if (balance) {
      dispatch({
        type: "SET_BALANCE",
        payload: {
          [treasuryAddr]: balance,
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
    dispatch({ type: "SET_CREATING_TREASURY" });
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

  const sendFlowToTreasury = async (amount) => {
    const res = await doSendFlowToTreasury(
      treasuryAddr,
      String(parseFloat(amount).toFixed(8))
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeTransfer = async (
    recipientAddr, 
    amount,
    message,
    keyIds,
    signatures,
    height
  ) => {
    const res = await doProposeTransfer(
      treasuryAddr,
      recipientAddr,
      parseFloat(amount).toFixed(8),
      message,
      keyIds,
      signatures,
      height
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
  };

  const updateThreshold = async (
    newThreshold,
    message,
    keyIds,
    signatures,
    height
  ) => {
    const res = await doUpdateThreshold(
      newThreshold,
      message,
      keyIds,
      signatures,
      height
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const addSigner = async (
    newSignerAddress,
    message,
    keyIds,
    signatures,
    height
  ) => {
    const res = await doAddSigner(
      newSignerAddress,
      message,
      keyIds,
      signatures,
      height
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const updateSigner = async (oldSignerAddress, newSignerAddress) => {
    const res = await doUpdateSigner(oldSignerAddress, newSignerAddress);
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  return {
    ...state,
    refreshTreasury,
    createTreasury,
    fetchTreasury,
    setTreasury,
    sendFlowToTreasury,
    proposeTransfer,
    signerApprove,
    executeAction,
    updateThreshold,
    addSigner,
    updateSigner,
  };
}
