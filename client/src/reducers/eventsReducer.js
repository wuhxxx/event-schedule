import {
    SET_EVENTS,
    ADD_EVENT,
    DELETE_EVENTS,
    UPDATE_EVENT,
    SET_ERROR,
    CLEAR_ERROR,
    LOAD_USER_EVENTS_BEGIN,
    LOAD_USER_EVENTS_FINISH
} from "../actions/actionTypes.js";

const initialState = {
    events: [],
    error: null,
    isLoadingUserEvents: false,
    isRequestingEventAPI: false
};

// Event reducer
export default function(preState = initialState, action) {
    switch (action.type) {
        case SET_EVENTS:
            return {
                ...preState,
                events: action.events
            };
        case ADD_EVENT:
            return {
                ...preState,
                events: [...preState.events, action.event]
            };
        case DELETE_EVENTS:
            return {
                ...preState,
                events: preState.events.filter(
                    event => action.eventIdsToDelete.indexOf(event.eventId) < 0
                )
            };
        case UPDATE_EVENT:
            return {
                ...preState,
                events: preState.events.map(event =>
                    event.eventId === action.newEvent.eventId
                        ? action.newEvent
                        : event
                )
            };
        case SET_ERROR:
            return {
                ...preState,
                error: action.error
            };
        case CLEAR_ERROR:
            return {
                ...preState,
                error: null
            };
        case LOAD_USER_EVENTS_BEGIN:
            return {
                ...preState,
                isLoadingUserEvents: true
            };
        case LOAD_USER_EVENTS_FINISH:
            return {
                ...preState,
                isLoadingUserEvents: false
            };
        default:
            return preState;
    }
}
