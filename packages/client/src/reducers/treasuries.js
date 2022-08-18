export const INITIAL_STATE = {
  loadingTreasuries: "Loading Treasuries",
  error: null,
  creatingTreasury: false,
  createdTreasury: false,
  submittedTransaction: false,
  treasuries: {},
  actions: {},
  balances: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_TREASURIES": {
      return {
        ...state,
        treasuries: {},
      };
    }
    case "SET_TREASURY": {
      const address = Object.keys(action.payload)[0];
      return {
        ...state,
        treasuries: {
          ...state.treasuries,
          [address]: {
            ...state.treasuries[address],
            ...action.payload[address],
          },
        },
        loadingTreasuries: null,
        error: null,
      };
    }
    case "SET_ACTIONS": {
      console.log("dispatching set actions", action.payload);
      return {
        ...state,
        actions: {
          ...state.actions,
          ...action.payload,
        },
      };
    }
    case "SET_BALANCE": {
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload,
        },
      };
    }
    case "SET_CREATING_TREASURY":
      return {
        ...state,
        creatingTreasury: action.payload,
      };
    case "SUBMITTED_TREASURY_TRANSACTION":
      return {
        ...state,
        submittedTransaction: true,
      };
    case "TREASURY_TRANSACTION_SUCCESS":
      return {
        ...state,
        createdTreasury: true,
      };
    case "SET_LOADING":
      return {
        ...state,
        loadingTreasuries: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        loadingTreasuries: false,
        error: action.payload.error,
      };
    default:
      throw new Error();
  }
};

export default reducer;
