import {
  AUTH_FAILURE,
  AUTH_START,
  AUTH_SUCCESS,
  CHECK_AUTH_FAILURE,
  CHECK_AUTH_START,
  CHECK_AUTH_SUCCESS,
  SET_IS_AUTHENTICATED,
} from "./authTypes";

import publicAxios from "../../lib/publicAxios";

const _isAuthenticated = (token, expiresAt) => {
  if (!token || !expiresAt) {
    return false;
  }

  return new Date().getTime() / 1000 < expiresAt;
};

export function isAuthenticated() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const expiresAt = getState().auth.expiresAt;

    const authStatus = _isAuthenticated(token, expiresAt);
    dispatch({ type: SET_IS_AUTHENTICATED, payload: authStatus });
  };
}

export function checkAuthState() {
  return (dispatch) => {
    dispatch({ type: CHECK_AUTH_START });

    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
    const userInfo = localStorage.getItem("userInfo");

    const authStatus = _isAuthenticated(token, expiresAt);

    if (authStatus) {
      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          token,
          expiresAt,
          userInfo: userInfo ? JSON.parse(userInfo) : {},
        },
      });
      dispatch({ type: CHECK_AUTH_SUCCESS });
    } else {
      dispatch(isAuthenticated());
      dispatch({ type: CHECK_AUTH_FAILURE });
    }
  };
}

export function authenticate({ mobileNumber, password }, callback) {
  return async (dispatch) => {
    dispatch({ type: AUTH_START });

    try {
      console.log(publicAxios.defaults.baseURL);
      const { data } = await publicAxios.post("/auth/login", {
        mobileNumber,
        password,
      });
      const token = data.token;
      const expiresAt = data.expiresAt;

      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiresAt);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      dispatch({
        type: AUTH_SUCCESS,
        payload: {
          token,
          expiresAt,
          userInfo: data.user,
        },
      });

      callback?.();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        dispatch({
          type: AUTH_FAILURE,
          payload: error.response.data.message,
        });
      } else {
        dispatch({
          type: AUTH_FAILURE,
          payload: error.message ? error.message : error,
        });
      }
    }
  };
}
