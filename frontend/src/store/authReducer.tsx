import * as actionTypes from './authActionTypes';
import { UpdatePasswordFailAction, UpdatePasswordActionTypes } from './authActions';

// Initial State
export interface AuthState {
    error: any;  // You may want to refine this type
    loading: boolean;
    token: string | null;
}

export const initialState: AuthState = {
    error: null,
    loading: false,
    token: null,
};

// A function to update the state with new values
const updateObject = <T extends {}>(oldObject: T, updatedProperties: Partial<T>): T => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

// Action types
export interface AuthAction {
    type: typeof actionTypes[keyof typeof actionTypes];
    [key: string]: any;
}

// Different Reducer Functions which change the store state
const authStartReducer = (state: AuthState, action: AuthAction): AuthState => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const authSuccessReducer = (state: AuthState, action: AuthAction): AuthState => {
    return updateObject(state, {
        error: null,
        loading: false,
        token: action.token,
    });
};

const authFailReducer = (state: AuthState, action: AuthAction): AuthState => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};

const authLogoutReducer = (state: AuthState, action: AuthAction): AuthState => {
    return updateObject(state, {
        token: null,
    });
};

const updatePasswordStart = (state: AuthState): AuthState => {
    return updateObject(state, {
        error: null,
        loading: true,
    });
};

const updatePasswordSuccess = (state: AuthState): AuthState => {
    return updateObject(state, {
        error: null,
        loading: false,
    });
};

const updatePasswordFail = (state: AuthState, action: UpdatePasswordFailAction): AuthState => {
    return updateObject(state, {
        error: action.error,
        loading: false,
    });
};


// The Main Reducer 
const Reducer = (state: AuthState = initialState, action: AuthAction | UpdatePasswordActionTypes): AuthState => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStartReducer(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccessReducer(state, action);
        case actionTypes.AUTH_FAIL: return authFailReducer(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogoutReducer(state, action);
        case actionTypes.UPDATE_PASSWORD_START: return updatePasswordStart(state);
        case actionTypes.UPDATE_PASSWORD_SUCCESS: return updatePasswordSuccess(state);
        case actionTypes.UPDATE_PASSWORD_FAIL: return updatePasswordFail(state, action as UpdatePasswordFailAction);
        default:
            return state;
    }
};

export default Reducer;