export const VAULT_INITIAL_STATE = {
  error: null,
  vaults: {},
};

const vaultReducer = (state = VAULT_INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_VAULTS": {
      const address = Object.keys(action.payload)[0];
      return {
        ...state,
        vaults: {
          ...state.vaults,
          [address]: action.payload[address],
        },
        loadingVaults: false,
        error: null,
      };
    }
    case "ADD_VAULT": {
      const address = Object.keys(action.payload)[0];
      const existingVaults = state.vaults[address] || [];

      return {
        ...state,
        vaults: {
          ...state.vaults,
          [address]: [...existingVaults, action.payload[address]],
        },
        loadingVaults: false,
        error: null,
      };
    }
    case "REMOVE_VAULT": {
      const address = Object.keys(action.payload)[0];
      const vaults = state.vaults[address];
      const vaultIdToRemove = vaults.findIndex(
        (vault) => vault === action.payload[address]
      );
      return {
        ...state,
        vaults: {
          ...state.vaults,
          [address]: [
            ...vaults.slice(0, vaultIdToRemove),
            ...vaults.slice(vaultIdToRemove + 1),
          ],
        },
        loadingVaults: false,
        error: null,
      };
    }
    case "ERROR":
      return {
        ...state,
        loadingVaults: false,
        error: action.payload.error,
      };
    default:
      throw new Error();
  }
};

export default vaultReducer;
