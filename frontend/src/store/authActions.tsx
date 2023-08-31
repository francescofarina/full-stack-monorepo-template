import axios, { AxiosError } from "axios";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import * as actionTypes from "./authActionTypes";
import * as settings from "../settings";
import { getCookie } from "../utils";

const SESSION_DURATION = settings.SESSION_DURATION;

// Define interfaces for your action objects
interface AuthStartAction {
  type: typeof actionTypes.AUTH_START;
}

interface AuthSuccessAction {
  type: typeof actionTypes.AUTH_SUCCESS;
  token: string;
}

interface AuthFailAction {
  type: typeof actionTypes.AUTH_FAIL;
  error: any;
}

interface AuthLogoutAction {
  type: typeof actionTypes.AUTH_LOGOUT;
}

type AuthActionTypes =
  | AuthStartAction
  | AuthSuccessAction
  | AuthFailAction
  | AuthLogoutAction;

interface UpdatePasswordStartAction {
  type: typeof actionTypes.UPDATE_PASSWORD_START;
}

interface UpdatePasswordSuccessAction {
  type: typeof actionTypes.UPDATE_PASSWORD_SUCCESS;
}

export interface UpdatePasswordFailAction {
  type: typeof actionTypes.UPDATE_PASSWORD_FAIL;
  error: any;
}

export type UpdatePasswordActionTypes =
  | UpdatePasswordStartAction
  | UpdatePasswordSuccessAction
  | UpdatePasswordFailAction;

// Auth Action Functions returning Action Objects
export const authStart = (): AuthStartAction => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token: string): AuthSuccessAction => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
  };
};

export const authFail = (error: any): AuthFailAction => {
  return {
    type: actionTypes.AUTH_FAIL,
    error,
  };
};

export const authLogout = (): AuthLogoutAction => {
  const token = localStorage.getItem("token");
  if (token === null) {
    localStorage.removeItem("expirationDate");
  } else {
    axios
      .post(
        `${settings.API_SERVER}/api/auth/logout/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });

    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const updatePasswordStart = (): UpdatePasswordStartAction => {
  return {
    type: actionTypes.UPDATE_PASSWORD_START,
  };
};

export const updatePasswordSuccess = (): UpdatePasswordSuccessAction => {
  return {
    type: actionTypes.UPDATE_PASSWORD_SUCCESS,
  };
};

export const updatePasswordFail = (error: any): UpdatePasswordFailAction => {
  return {
    type: actionTypes.UPDATE_PASSWORD_FAIL,
    error,
  };
};

export const updatePassword = (
  newPassword1: string,
  newPassword2: string,
  token: string
): ThunkAction<void, {}, {}, AnyAction> => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(updatePasswordStart());
    axios
      .post(
        `${settings.API_SERVER}/api/auth/password/change/`,
        {
          new_password1: newPassword1,
          new_password2: newPassword2,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      )
      .then((res) => {
        dispatch(updatePasswordSuccess());
        localStorage.removeItem("token");
        localStorage.removeItem("expirationDate");
      })
      .catch((err: AxiosError) => {
        dispatch(updatePasswordFail(err));
      });
  };
};

// Auth Action Functions returning a Dispatch(Action) combination after performing some action
export const authCheckTimeout = (expirationTime: number) => {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime);
  };
};

export const authLogin = (
  username: string,
  password: string
): ThunkAction<void, {}, {}, AnyAction> => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(authStart());
    axios
      .post(
        `${settings.API_SERVER}/api/auth/login/`,
        {
          username,
          password,
        },
        {
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
        }
      )
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(
          new Date().getTime() + SESSION_DURATION
        );
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate.toString());
        dispatch(authSuccess(token));
        //@ts-ignore
        dispatch(authCheckTimeout(SESSION_DURATION));
      })
      .catch((err: AxiosError) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = (): ThunkAction<void, {}, {}, AnyAction> => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const token = localStorage.getItem("token");
    if (token === null) {
      dispatch(authLogout());
    } else {
      const expirationDate = new Date(
        localStorage.getItem("expirationDate") || ""
      );
      if (expirationDate <= new Date()) {
        dispatch(authLogout());
      } else {
        dispatch(authSuccess(token));
        //@ts-ignore
        dispatch(
          authCheckTimeout(expirationDate.getTime() - new Date().getTime())
        );
      }
    }
  };
};
