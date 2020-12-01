import { AUTH_FAILURE, AUTH_START, AUTH_SUCCESS } from "./authTypes";

const initialState = {
  loading: false,
  error: null,
  token: null,
  expiresAt: null,
  userInfo: {},
  isAuthenticated: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isAuthenticated: true,
        ...action.payload,
      };
    case AUTH_FAILURE:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
