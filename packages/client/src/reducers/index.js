export const INITIAL_STATE = {
  loading: true,
  error: false,
  data: null,
  errorData: null,
};

export const defaultReducer = (state, action) => {
  switch (action.type) {
    case "PROCESSING":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: true,
        errorData: action.payload.errorData,
      };
    default:
      throw new Error();
  }
};
