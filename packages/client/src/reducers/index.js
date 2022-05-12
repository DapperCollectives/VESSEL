export const INITIAL_STATE = {
  loading: "Loading Treasuries",
  error: null,
  creatingTreasury: false,
  createdTreasury: false,
  submittedTransaction: false,
  treasuries: {},
};

const defaultReducer = (state, action) => {
  switch (action.type) {
    case "SET_TREASURY":
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
        loading: null,
        error: null,
      };
    case "SET_CREATING_TREASURY":
      return {
        ...state,
        creatingTreasury: true,
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
        loading: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      throw new Error();
  }
};

export default defaultReducer;
