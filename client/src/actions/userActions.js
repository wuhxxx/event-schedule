import axios from "axios";
import { USER_LOG_OUT, USER_SIGN_IN } from "./actionTypes.js";
import { loadUserEvents, clearEvents } from "./eventActions.js";
import {
    AUTH_HEADER,
    LOCAL_USERNAME_KEY,
    LOCAL_TOKEN_KEY,
    LOCAL_EXPIRESAT_KEY
} from "../constants";

/**
 * User sign in action creator, return corresponding action,
 * also set axios auth token and save user info to local
 * @param {Object} userData response data from backend '/users' route
 * @param {Boolean} toRememberUser true if remember user
 */
export const signUserIn = (userData, toRememberUser) => dispatch => {
    console.log("sign in user: ", userData);
    const { username, token } = userData;
    // bearer token
    const authToken = `${AUTH_HEADER} ${token}`;
    // set axios auth token, this will apply to all sequential requests
    axios.defaults.headers.common["Authorization"] = authToken;
    // save to localStorage
    if (toRememberUser) {
        // number of milesecond at which token expires according to local time
        const expiresAt = Date.now() + userData.expiresIn * 1000;
        localStorage.setItem(LOCAL_USERNAME_KEY, username);
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
        localStorage.setItem(LOCAL_EXPIRESAT_KEY, expiresAt);
    }
    // dispatch signin action
    dispatch({
        type: USER_SIGN_IN,
        username
    });
    // dispatch load user events action
    dispatch(loadUserEvents());
};

export const logUserOut = () => dispatch => {
    // delete axios auth token, this will apply to all sequential requests
    delete axios.defaults.headers.common["Authorization"];
    // delete user info in localStorage
    localStorage.removeItem(LOCAL_USERNAME_KEY);
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem(LOCAL_EXPIRESAT_KEY);
    // dispatch log out action
    dispatch({
        type: USER_LOG_OUT
    });
    // dispatch clear events action
    dispatch(clearEvents());
};
