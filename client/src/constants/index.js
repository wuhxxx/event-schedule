/********************** local storage related constants **********************/
export const LOCAL_USERNAME_KEY = "USERNAME_KEY";
export const LOCAL_TOKEN_KEY = "TOKEN_KEY";
export const LOCAL_EXPIRESAT_KEY = "EXPIRESAT_KEY";

/********************** Schedule related constants **********************/
// unit duration of timeline, number of minutes
export const TIMELINE_UNIT_DURATION = 30;
// event slot height in schedule grid, number of px
export const EVENT_SLOT_HEIGHT = 50;
// minimal event duation to render event time span, number of minutes
export const MIN_DURATION_TO_RENDER_TIME = 50;
// minimal event duation to render event title, number of minutes
export const MIN_DURATION_TO_RENDER_TITLE = 15;
// default timeline start time;
export const DEFAULT_FROM = 9 * 2 * 30;
// default timeline end time;
export const DEFAULT_TO = 18 * 2 * 30;
// week days
export const WEEK_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];
// default event info
export const DEFAULT_EVENT = {
    title: "", // string, required
    location: "", // string
    description: "", // string
    color: 6911625, // number, required
    startAt: 9 * 60, // number, required
    endAt: 9 * 60 + 30, // number, required
    weekday: 0 // number, required
};
// color choices of color picker
export const COLOR_CHOICES = [
    "#0097A7",
    "#0693E3",
    "#443453",
    "#555555",
    "#577F92",
    "#697689",
    "#7BDCB5",
    "#8ED1FC",
    "#A2B9B2",
    "#AFB42B",
    "#F6B067",
    "#F57F17",
    "#F78DA7",
    "#E64A19"
];

/********************** TopBar related constants **********************/
// login modal states
export const SIGNIN_FORM = "Signin";
export const RESET_FORM = "Reset";
export const SIGNUP_FORM = "Signup";
// login/signup form input fields
export const USERNAME = "username";
export const EMAIL = "email";
export const PASSWORD = "password";
// login/signup form input fields error
export const USERNAME_ERROR = "USERNAME_ERROR";
export const EMAIL_ERROR = "EMAIL_ERROR";
export const PASSWORD_ERROR = "PASSWORD_ERROR";

/********************** API related constants **********************/
// api routes
export const USER_API_ROUTE = `http://localhost:${process.env.PORT ||
    8000}/api/v1/users`;
export const EVENT_API_ROUTE = `http://localhost:${process.env.PORT ||
    8000}/api/v1/events`;
// Authentication header prefix
export const AUTH_HEADER = "Bearer";
// least time interval after which token be available
export const LEAST_TOKEN_AVAILABLE_INTERVAL = 1000 * 60 * 60 * 4; // 4 hours
// backend error responses
export const AUTH_ERRORS = {
    Unauthorized: "Unauthorized",
    JsonWebTokenError: "JsonWebTokenError",
    TokenExpiredError: "TokenExpiredError",
    DeletedUser: "DeletedUser"
};

export const USER_ERRORS = {
    EmailRegistered: "EmailRegistered",
    UserNotFound: "UserNotFound",
    WrongPassword: "WrongPassword"
};

export const EVENT_ERRORS = { EventNotFound: "EventNotFound" };

/********************** demo events **********************/
// comes from codyHouse simple-schedule template
export { default as DEMO_EVENTS } from "./demoEvents.js";
