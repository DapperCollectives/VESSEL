import { useEffect, useReducer } from "react";
import { query } from "@onflow/fcl";
import reducer, { INITIAL_STATE } from "../reducers/vaults";
import {
    GET_TREASURY_IDENTIFIERS,
  } from "../flow";

const storageKey = "vessel-vaults";

export default function useVaults() {
    const [state, dispatch] = useReducer(reducer, [], (initial) => ({
        ...initial,
        ...INITIAL_STATE,
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
        console.log(vaults);

        dispatch({
            type: "SET_VAULTS",
            payload: {
                [treasuryAddr]: vaults
            },
        });
    };

    return {
        ...state,
        getTreasuryVaults
    }
}
