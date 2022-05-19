import { useEffect, useReducer } from "react";
import { mutate, query, tx } from "@onflow/fcl";

import reducer from "../reducers";
import { INITIALIZE_TREASURY } from "../flow/initializeTreasury.tx";
import { GET_SIGNERS, GET_THRESHOLD } from "../flow/checkTreasuries.tx";
import { CHECK_TREASURY_OWNER_ADDRESS } from "../flow/checkTreasuryOwners.tx";

const storageKey = "vessel-treasuries";
const initialState = {
  loading: "Loading Treasuries",
  creatingTreasury: false,
  createdTreasury: false,
  submittedTransaction: false,
  treasuries: {},
};

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
    limit: 55,
  });
};

const getSigners = async (address) => {
  return await doQuery(GET_SIGNERS, address);
};

const getThreshold = async (address) => {
  return await doQuery(GET_THRESHOLD, address);
};

export default function useTreasury(address) {
  const [state, dispatch] = useReducer(reducer, [], (initial) => ({
    ...initial,
    ...initialState,
    treasuries: JSON.parse(localStorage.getItem(storageKey)) || {},
  }));

  useEffect(() => {
    if (!address) {
      if (state.loading) {
        dispatch({ type: "SET_LOADING", payload: false });
      }
      return;
    }
    const checkTreasuries = async () => {
      const signers = await getSigners(address);
      if (signers) {
        const threshold = await getThreshold(address);
        dispatch({
          type: "SET_TREASURY",
          payload: {
            [address]: {
              signers,
              threshold,
            },
          },
        });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    checkTreasuries();
  }, [state.loading, address]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state.treasuries));
  }, [state.treasuries]);

  const createTreasury = async (treasuryData) => {
    dispatch({ type: "SET_CREATING_TREASURY" });
    const { safeOwners, threshold } = treasuryData;
    const signerAddresses = safeOwners.map((is) => is.address);
    const res = await doCreateTreasury(signerAddresses, threshold);
    if (res) {
      dispatch({ type: "SUBMITTED_TREASURY_TRANSACTION" });
    }
    await tx(res).onceSealed();
    setTreasury(address, treasuryData);
    dispatch({ type: "TREASURY_TRANSACTION_SUCCESS" });
    return res;
  };

  const setTreasury = (_address, treasuryData) => {
    dispatch({
      type: "SET_TREASURY",
      payload: {
        [_address]: treasuryData,
      },
    });
  };

  const fetchTreasury = async (_address) => {
    const signers = await getSigners(_address);
    if (signers) {
      const threshold = await getThreshold(_address);
      return { threshold, signers };
    }

    return null;
  };

  const checkTreasuryOwnerAddress = async (address) => {
    return await doQuery(CHECK_TREASURY_OWNER_ADDRESS, address);
  };

  return {
    ...state,
    createTreasury,
    fetchTreasury,
    setTreasury,
    checkTreasuryOwnerAddress,
  };
}
