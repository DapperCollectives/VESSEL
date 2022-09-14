import { config, mutate, query, tx } from "@onflow/fcl";
import { useEffect, useReducer } from "react";
import { SIGNED_LIMIT } from "constants/constants";
import { COIN_TYPE_TO_META } from "constants/maps";
import { createSignature } from "contexts/Web3";
import { ADD_VAULT, GET_TREASURY_IDENTIFIERS, REMOVE_VAULT } from "../flow";
import vaultsReducer, { VAULTS_INITIAL_STATE } from "../reducers/vaults";
import { removeAddressPrefix } from "../utils";

const storageKey = "vessel-vaults";

const doAddVault = async (treasuryAddr, contractName, contractAddress) => {
  const intent = `A.${removeAddressPrefix(
    contractAddress
  )}.${contractName}.Vault`;
  const { message, keyIds, signatures, height } = await createSignature(intent);

  return await mutate({
    cadence: ADD_VAULT(contractName),
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

const doRemoveVault = async (treasuryAddr, identifier) => {
  const { message, keyIds, signatures, height } = await createSignature(
    identifier
  );

  return await mutate({
    cadence: REMOVE_VAULT,
    args: (arg, t) => [
      arg(treasuryAddr, t.Address),
      arg(identifier, t.String),
      arg(message, t.String),
      arg(keyIds, t.Array(t.UInt64)),
      arg(signatures, t.Array(t.String)),
      arg(height, t.UInt64),
    ],
    limit: SIGNED_LIMIT,
  });
};

export default function useVaults(treasuryAddr) {
  const [state, dispatch] = useReducer(vaultsReducer, [], (initial) => ({
    ...initial,
    ...VAULTS_INITIAL_STATE,
    vaults: JSON.parse(localStorage.getItem(storageKey) || "{}"),
  }));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state.vaults));
  }, [state.vaults]);

  const getTreasuryVaults = async (treasuryAddr) => {
    const identifiers = await query({
      cadence: GET_TREASURY_IDENTIFIERS,
      args: (arg, t) => [arg(treasuryAddr, t.Address)],
    }).catch(console.error);

    const vaults = (identifiers && identifiers[0]) ?? [];

    if (vaults.length !== 0) {
      dispatch({
        type: "SET_VAULTS",
        payload: {
          [treasuryAddr]: vaults,
        },
      });
    }
  };

  const addVault = async (coinType) => {
    const contractName = COIN_TYPE_TO_META[coinType].contractName;
    const contractAddress = await config().get(`0x${contractName}`);
    const res = await doAddVault(treasuryAddr, contractName, contractAddress);
    await tx(res).onceSealed();

    const identifier = `A.${removeAddressPrefix(
      contractAddress
    )}.${contractName}.Vault`;

    dispatch({
      type: "ADD_VAULT",
      payload: {
        [treasuryAddr]: identifier,
      },
    });
  };

  const removeVault = async (identifier) => {
    const res = await doRemoveVault(treasuryAddr, identifier);
    await tx(res).onceSealed();

    dispatch({
      type: "REMOVE_VAULT",
      payload: {
        [treasuryAddr]: identifier,
      },
    });
  };

  return {
    ...state,
    getTreasuryVaults,
    addVault,
    removeVault,
  };
}
