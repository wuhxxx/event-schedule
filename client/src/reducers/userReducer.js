import { USER_SIGN_IN, USER_LOG_OUT } from "../actions/actionTypes.js";

const initialState = {
    isUserLoggedIn: false
};

export default function(preState = initialState, action) {
    switch (action.type) {
        case USER_SIGN_IN:
            const { username } = action;
            return {
                isUserLoggedIn: true,
                username
            };
        case USER_LOG_OUT:
            return initialState;
        default:
            return preState;
    }
}
