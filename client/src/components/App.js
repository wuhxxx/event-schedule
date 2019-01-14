import React, { Component } from "react";
import { createStore, compose, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducer from "../reducers";
import thunk from "redux-thunk";
import { signUserIn } from "../actions/userActions.js";
import { loadDemoEvents } from "../actions/eventActions.js";
import { ToastContainer, toast } from "react-toastify";
import {
    LOCAL_USERNAME_KEY,
    LOCAL_TOKEN_KEY,
    LOCAL_EXPIRESAT_KEY,
    LEAST_TOKEN_AVAILABLE_INTERVAL
} from "../constants";
import TopBar from "./TopBar";
import Schedule from "./Schedule";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/App.css";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const middlewares = [thunk];

const store = createStore(
    reducer,
    compose(
        applyMiddleware(...middlewares),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

// check if token exists and valid at initialization
const username = localStorage.getItem(LOCAL_USERNAME_KEY);
const token = localStorage.getItem(LOCAL_TOKEN_KEY);
const expiresAt = localStorage.getItem(LOCAL_EXPIRESAT_KEY);
// token must be valid until this time, or user need to sign in again
const leastValidUntil = Date.now() + LEAST_TOKEN_AVAILABLE_INTERVAL;
if (username && token && expiresAt && expiresAt > leastValidUntil) {
    store.dispatch(signUserIn({ username, token }, false));
} else {
    store.dispatch(loadDemoEvents());
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <TopBar />
                    <Schedule />
                    <ToastContainer
                        position={toast.POSITION.TOP_CENTER}
                        autoClose={3500}
                        toastClassName="toast"
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover
                    />
                </div>
            </Provider>
        );
    }
}

export default App;
