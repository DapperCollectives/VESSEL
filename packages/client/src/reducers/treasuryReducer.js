export const TREASURY_INITIAL_STATE = {
  loadingTreasuries: 'Loading Treasuries',
  error: null,
  submittedTransaction: false,
  treasuries: {},
  actions: {},
  balances: {},
};

const treasuryReducer = (state, action) => {
  switch (action.type) {
    case 'CLEAR_TREASURIES': {
      return {
        ...state,
        treasuries: {},
      };
    }
    case 'SET_TREASURY': {
      const address = Object.keys(action.payload)[0];
      return {
        ...state,
        treasuries: {
          ...state.treasuries,
          [address]: {
            ...action.payload[address],
          },
        },
        loadingTreasuries: null,
        error: null,
      };
    }
    case 'SET_ACTIONS': {
      return {
        ...state,
        actions: {
          ...state.actions,
          ...action.payload,
        },
      };
    }
    case 'SET_BALANCE': {
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload,
        },
      };
    }
    case 'SUBMITTED_TREASURY_TRANSACTION':
      return {
        ...state,
        submittedTransaction: true,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loadingTreasuries: action.payload,
      };
    case 'ERROR':
      return {
        ...state,
        loadingTreasuries: false,
        error: action.payload.error,
      };
    default:
      throw new Error();
  }
};

export default treasuryReducer;
