export const INITIAL_STATE = {
    error: null,
    vaults: {},
};

const reducer = (state = INITIAL_STATE, action) => {
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

export default reducer;