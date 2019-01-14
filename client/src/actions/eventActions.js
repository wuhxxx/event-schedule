import axios from "axios";
import { DEMO_EVENTS, EVENT_API_ROUTE } from "../constants";
import {
    SET_EVENTS,
    ADD_EVENT,
    DELETE_EVENTS,
    UPDATE_EVENT,
    SET_ERROR,
    CLEAR_ERROR,
    LOAD_USER_EVENTS_BEGIN,
    LOAD_USER_EVENTS_FINISH
} from "./actionTypes.js";

// set store's events using given events
export const setEvents = events => dispatch => {
    // events should be an array of event objects
    dispatch({
        type: SET_EVENTS,
        events
    });
};

// clear store's events
export const clearEvents = () => setEvents([]);

// add event locally
export const addEvent = event => dispatch => {
    dispatch({
        type: ADD_EVENT,
        event
    });
};

// delete events locally
export const deleteEvents = eventIdsToDelete => dispatch => {
    // eventIdsToDelete should be an array of event ids
    dispatch({
        type: DELETE_EVENTS,
        eventIdsToDelete
    });
};

// update event locally
export const updateEvent = newEvent => dispatch => {
    dispatch({
        type: UPDATE_EVENT,
        newEvent
    });
};

export const setError = error => dispatch => {
    dispatch({
        type: SET_ERROR,
        error
    });
};

export const clearError = () => dispatch => {
    dispatch({
        type: CLEAR_ERROR
    });
};

// load demo events
export const loadDemoEvents = () => dispatch => {
    dispatch(setEvents(DEMO_EVENTS));
};

// todo: handle token expired
// load user's event from API
export const loadUserEvents = () => dispatch => {
    dispatch({ type: LOAD_USER_EVENTS_BEGIN });
    axios
        .get(`${EVENT_API_ROUTE}/all`)
        .then(res => {
            dispatch({ type: LOAD_USER_EVENTS_FINISH });
            const userEvents = res.data.data.events;
            dispatch(setEvents(userEvents));
        })
        .catch(err => {
            dispatch({ type: LOAD_USER_EVENTS_FINISH });
            if (err.response) {
                // http error response
                const errorRes = err.response.data.error;
                dispatch(setError(errorRes));
            } else {
                // local network error
                dispatch(setError(err));
            }
        });
};
