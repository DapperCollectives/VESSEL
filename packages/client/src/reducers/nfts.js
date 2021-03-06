export const INITIAL_STATE = {
  error: null,
  NFTs: {},
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_NFTS": {
      const address = Object.keys(action.payload)[0];
      return {
        ...state,
        NFTs: {
          ...state.NFTs,
          [address]: {
            ...state.NFTs[address],
            ...action.payload[address],
          },
        },
        loadingNFTs: false,
        error: null,
      };
    }
    case "ERROR":
      return {
        ...state,
        loadingNFTs: false,
        error: action.payload.error,
      };
    default:
      throw new Error();
  }
};

export default reducer;
