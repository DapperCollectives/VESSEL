/*
 * addressAliases is a dicitonary of address<string>[name<string>]
 */
export const ADDRESS_ALIAS_INITIAL_STATE = {
  addressAliases: {},
};

const addressAliasReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_ALIAS': {
      return {
        ...state,
        addressAliases: {
          ...state.addressAliases,
          ...action.payload,
        },
      };
    }
    case 'REMOVE_ADDRESS_ALIAS': {
      const aliases = state.addressAliases;
      delete aliases[action.payload];
      return {
        ...state,
        addressAliases: aliases,
      };
    }
    case 'SET_TREASURY_ALIAS': {
      return {
        ...state,
        treasuryAliases: {
          ...state.treasuryAliases,
          ...action.payload,
        },
      };
    }
    default:
      throw new Error();
  }
};

export default addressAliasReducer;
