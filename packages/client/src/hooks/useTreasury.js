import { useEffect, useReducer } from 'react';
import { createSignature } from 'contexts/Web3';
import {
  CREATE_TREASURY_LIMIT,
  EXECUTE_ACTION_LIMIT,
  SIGNED_LIMIT,
  SIGNER_APPROVE_LIMIT,
} from 'constants/constants';
import { COIN_TYPE_TO_META } from 'constants/maps';
import {
  formatAddress,
  getTokenMeta,
  getVaultId,
  syncSafeOwnersWithSigners,
} from '../utils';
import { mutate, query, tx } from '@onflow/fcl';
import {
  ADD_SIGNER_UPDATE_THRESHOLD,
  EXECUTE_ACTION,
  GET_ACTION_VIEW,
  GET_PROPOSED_ACTIONS,
  GET_SIGNERS_FOR_ACTION,
  GET_TREASURY,
  GET_TREASURY_IDENTIFIERS,
  GET_VAULT_BALANCE,
  INITIALIZE_TREASURY,
  PROPOSE_TRANSFER,
  REMOVE_SIGNER_UPDATE_THRESHOLD,
  SIGNER_APPROVE,
  SIGNER_REJECT,
  UPDATE_THRESHOLD,
} from '../flow';
import treasuryReducer, {
  TREASURY_INITIAL_STATE,
} from '../reducers/treasuryReducer';

const storageKey = 'vessel-treasuries';

const doQuery = async (cadence, address) => {
  const queryResp = await query({
    cadence,
    args: (arg, t) => [arg(address, t.Address)],
  }).catch(console.error);

  return queryResp;
};

const doCreateTreasury = async (signerAddresses, threshold) =>
  await mutate({
    cadence: INITIALIZE_TREASURY,
    args: (arg, t) => [
      arg(signerAddresses, t.Array(t.Address)),
      arg(threshold, t.UInt),
    ],
    limit: CREATE_TREASURY_LIMIT,
  });

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
) =>
  await mutate({
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

const doSignReject = async (
  treasuryAddr,
  actionUUID,
  message,
  keyIds,
  signatures,
  signatureBlock
) =>
  await mutate({
    cadence: SIGNER_REJECT,
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
      arg(newThreshold, t.UInt),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doProposeAddSigner = async (
  treasuryAddr,
  newSignerAddress,
  newThreshold
) => {
  const intent = `Add signer ${newSignerAddress}. Update the threshold of signers to ${newThreshold}.`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: ADD_SIGNER_UPDATE_THRESHOLD,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(newSignerAddress, t.Address),
      arg(newThreshold, t.UInt),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doProposeRemoveSigner = async (
  treasuryAddr,
  signerToBeRemovedAddress,
  newThreshold
) => {
  const intent = `Remove signer ${signerToBeRemovedAddress}. Update the threshold of signers to ${newThreshold}.`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: REMOVE_SIGNER_UPDATE_THRESHOLD,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(signerToBeRemovedAddress, t.Address),
      arg(newThreshold, t.UInt),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const getTreasury = async (address) => await doQuery(GET_TREASURY, address);

const getProposedActions = async (address) =>
  await doQuery(GET_PROPOSED_ACTIONS, address);

const getActionView = async (address, actionUUID) =>
  await query({
    cadence: GET_ACTION_VIEW,
    args: (arg, t) => [arg(address, t.Address), arg(actionUUID, t.UInt64)],
  }).catch(console.error);

const getSignersForAction = async (address, actionUUID) =>
  await query({
    cadence: GET_SIGNERS_FOR_ACTION,
    args: (arg, t) => [arg(address, t.Address), arg(actionUUID, t.UInt64)],
  }).catch(console.error);

const getVaultBalance = async (address, vaultId) =>
  await query({
    cadence: GET_VAULT_BALANCE,
    args: (arg, t) => [arg(address, t.Address), arg(vaultId, t.String)],
  });

const getAllVaultBalance = async (address) => {
  const allBalance = {};
  try {
    const identifiers = await doQuery(GET_TREASURY_IDENTIFIERS, address);
    const vaultIdentifiers = identifiers[0];
    for await (const vaultId of vaultIdentifiers) {
      const balance = await getVaultBalance(address, vaultId);
      const { tokenType } = getTokenMeta(vaultId);
      allBalance[tokenType] = balance;
    }
  } catch (e) {
    console.log(e);
  }
  return allBalance;
};
export default function useTreasury(treasuryAddr) {
  const [state, dispatch] = useReducer(treasuryReducer, [], (initial) => ({
    ...initial,
    ...TREASURY_INITIAL_STATE,
    treasuries: JSON.parse(localStorage.getItem(storageKey)) || {},
  }));

  const refreshTreasury = async () => {
    console.log('REFRESH TREASURY');
    const treasuryData = await getTreasury(treasuryAddr);
    if (!treasuryData?.uuid) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    dispatch({
      type: 'SET_TREASURY',
      payload: {
        [treasuryAddr]: {
          address: treasuryAddr,
          ...treasuryData,
        },
      },
    });

    const allBalance = await getAllVaultBalance(treasuryAddr);

    if (allBalance) {
      dispatch({
        type: 'SET_BALANCE',
        payload: {
          [treasuryAddr]: allBalance,
        },
      });
    }

    const proposedActions = [];
    const proposedActionsResp = await getProposedActions(treasuryAddr);

    for (const action of Object.keys(proposedActionsResp ?? {})) {
      const uuid = parseInt(action, 10);
      const signerResponses = await getSignersForAction(
        treasuryAddr,
        parseInt(action, 10)
      );
      proposedActions.push({
        uuid,
        intent: proposedActionsResp[action],
        signerResponses,
      });
    }
    dispatch({
      type: 'SET_ACTIONS',
      payload: {
        [treasuryAddr]: proposedActions,
      },
    });
  };

  const updateOwnerList = async (treasuryAddr) => {
    const { signers } = await getTreasury(treasuryAddr);
    const { safeOwners } = state.treasuries[treasuryAddr];
    const updatedSafeOwners = syncSafeOwnersWithSigners(signers, safeOwners);
    dispatch({
      type: 'SET_TREASURY',
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
        dispatch({ type: 'SET_LOADING', payload: false });
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

  const setTreasury = (_treasuryAddr, treasuryData) => {
    dispatch({
      type: 'SET_TREASURY',
      payload: {
        [_treasuryAddr]: treasuryData,
      },
    });
  };
  const createTreasury = async (treasuryData) => {
    const { safeOwners, threshold } = treasuryData;
    const signerAddresses = safeOwners.map((is) => formatAddress(is.address));
    const creatorAddr = signerAddresses[0];
    const res = await doCreateTreasury(signerAddresses, threshold);
    if (res) {
      dispatch({ type: 'SUBMITTED_TREASURY_TRANSACTION' });
    }
    await tx(res).onceSealed();
    setTreasury(creatorAddr, treasuryData);
    return res;
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

  const signerReject = async (
    actionUUID,
    message,
    keyIds,
    signatures,
    signatureBlock
  ) => {
    const res = await doSignReject(
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
    const result = await tx(res).onceSealed();
    await refreshTreasury();
    await updateOwnerList(treasuryAddr);
    return result.events;
  };

  const updateThreshold = async (newThreshold) => {
    const res = await doUpdateThreshold(treasuryAddr, newThreshold);
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeAddSigner = async (newSignerAddress, newThreshold) => {
    const res = await doProposeAddSigner(
      treasuryAddr,
      newSignerAddress,
      newThreshold
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  const proposeRemoveSigner = async (
    signerToBeRemovedAddress,
    newThreshold
  ) => {
    const res = await doProposeRemoveSigner(
      treasuryAddr,
      signerToBeRemovedAddress,
      newThreshold
    );
    await tx(res).onceSealed();
    await refreshTreasury();
  };

  return {
    ...state,
    refreshTreasury,
    createTreasury,
    getTreasury,
    setTreasury,
    proposeTransfer,
    signerApprove,
    signerReject,
    executeAction,
    updateThreshold,
    proposeAddSigner,
    proposeRemoveSigner,
    getVaultBalance,
    getActionView,
  };
}
