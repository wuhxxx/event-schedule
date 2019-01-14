import { combineReducers } from "redux";
import User from "./userReducer.js";
import Event from "./eventsReducer.js";

export default combineReducers({
    User,
    Event
});
