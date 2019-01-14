import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { TwitterPicker } from "react-color";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { toHexColor, toDecimal } from "../../utils/colorConverters.js";
import { toTimeString, toNumOfMinutes } from "../../utils/timeConverters.js";
import { addEvent, updateEvent, setError } from "../../actions/eventActions.js";
import {
    WEEK_DAYS,
    DEFAULT_EVENT,
    COLOR_CHOICES,
    EVENT_API_ROUTE
} from "../../constants";

import "../../styles/EventForm.css";

// styled Button component
const StyledButton = withStyles({
    root: { marginLeft: 13 },
    label: { fontSize: 13 }
})(Button);

// helper function for generating custom TextField component
const customTextField = color =>
    withStyles(theme => ({
        underline: {
            "&:before": { borderBottomColor: color },
            "&:after": { borderBottomColor: color }
        },
        input: {
            color,
            lineHeight: "1.1875em",
            fontFamily: "PT Sans",
            fontSize: "1.6rem"
        },
        label: {
            color,
            fontFamily: "PT Sans",
            fontSize: "1.6rem",
            "&$labelFocused": { color }
        },
        labelFocused: {},
        helperText: {
            color,
            fontFamily: "PT Sans",
            fontSize: "1.1rem"
        }
    }))(props => {
        const { classes, ...otherProps } = props;
        return (
            <TextField
                {...otherProps}
                InputProps={{
                    classes: {
                        underline: classes.underline,
                        input: classes.input
                    }
                }}
                InputLabelProps={{
                    classes: {
                        root: classes.label,
                        focused: classes.labelFocused
                    }
                }}
                FormHelperTextProps={{
                    classes: { root: classes.helperText }
                }}
            />
        );
    });

// styled TextField component for header
const HeaderTextField = customTextField("white");

// styled TextField component for body
const BodyTextField = customTextField("black");

// There are two cases which triggers rendering edit mode modal:
//     1. Adding event by clicking "Add Event" button on <Schedule />
//     2. Updating event by clicking "Edit" button on view mode modal
class EventFormEditMode extends Component {
    static propTypes = {
        event: PropTypes.object,
        events: PropTypes.array.isRequired,
        addEvent: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
        updateEvent: PropTypes.func.isRequired,
        setViewMode: PropTypes.func.isRequired,
        isUserLoggedIn: PropTypes.bool.isRequired,
        handleCloseModal: PropTypes.func.isRequired
    };

    deriveStateFrom = props => {
        const event = props.event ? props.event : DEFAULT_EVENT;
        const { startAt, endAt, color, ...other } = event;
        // return an object, which should be assigned to state
        return {
            ...other,
            start: toTimeString(startAt),
            end: toTimeString(endAt),
            headerColor: toHexColor(color),
            isWaitingApi: false,
            error: {}
        };
    };

    constructor(props) {
        super(props);
        this.state = this.deriveStateFrom(props);
    }

    componentDidUpdate(prevProp) {
        if (prevProp.event !== this.props.event) {
            this.setState(this.deriveStateFrom(this.props));
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        // get values from props and state
        const {
            events,
            setError,
            addEvent,
            updateEvent,
            isUserLoggedIn,
            handleCloseModal
        } = this.props;
        const {
            title,
            location,
            description,
            start,
            end,
            weekday,
            headerColor
        } = this.state;
        // determine if updating event or adding event
        const isUpdatingEvent = this.props.event ? true : false;
        // get event id, if adding new event, assign a temporary event id
        let eventId = isUpdatingEvent
            ? this.props.event.eventId
            : Date.now().toString();

        // validate time interval
        const startAt = toNumOfMinutes(start),
            endAt = toNumOfMinutes(end);
        if (startAt >= endAt) {
            return this.setState({
                error: {
                    start: "Invalid interval",
                    end: "Invalid interval"
                }
            });
        }
        // validate if time interval has been used by other event
        // find events which has different id and on the same weekday
        const arr = events.filter(
            e => e.weekday === weekday && e.eventId !== eventId
        );
        for (let i = 0; i < arr.length; i++) {
            let e = arr[i];
            if (!(endAt <= e.startAt || startAt >= e.endAt)) {
                // interval overlaps with an existed event
                return this.setState({
                    error: {
                        start: "Overlapping interval",
                        end: "Overlapping interval"
                    }
                });
            }
        }

        // set event data from state
        const color = toDecimal(headerColor);
        const data = {
            title,
            location,
            description,
            startAt,
            endAt,
            weekday,
            color
        };

        let promise;
        debugger;
        // check if user logged in, if logged in, send request to api
        if (!isUserLoggedIn) {
            // no user logged in, just do adding/updating locally
            // set id
            data.eventId = eventId;
            // pass event data to next then()
            promise = Promise.resolve(data);
        } else {
            this.setState({ isWaitingApi: true });
            // call api, do remote thing
            if (isUpdatingEvent) {
                // request updating event
                promise = axios
                    .patch(`${EVENT_API_ROUTE}/${eventId}`, {
                        data
                    })
                    .then(res => {
                        // extract 'updatedEvent' and return to next then
                        return res.data.data.updatedEvent;
                    });
            } else {
                // request adding new event
                promise = axios.post(`${EVENT_API_ROUTE}`, data).then(res => {
                    // extract 'savedEvent' and return to next then
                    return res.data.data.savedEvent;
                });
            }
        }

        // do local thing, change events array in redux store or handle error
        return promise
            .then(eventData => {
                console.log("Event data: ", eventData);
                // done waiting api
                this.setState({ isWaitingApi: false });
                // add/update event locally
                if (isUpdatingEvent) updateEvent(eventData);
                else addEvent(eventData);
                // reset form
                this.setState(this.deriveStateFrom(this.props));
                // close modal
                handleCloseModal();
                // emit toast
                const toastMsg = isUpdatingEvent
                    ? "✏️ Event updated!"
                    : "📌 Event added!";
                toast(toastMsg);
            })
            .catch(err => {
                this.setState({ isWaitingApi: false });
                if (err.response) {
                    // http error, dispatch set error action
                    const errorRes = err.response.data.error;
                    setError(errorRes);
                    // close modal
                    handleCloseModal();
                } else {
                    // local network error, just emit toast
                    toast.warn("😱 Connection to server failed");
                }
            });
    };

    handleColorChange = (color, event) => {
        this.setState({ headerColor: color.hex });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value, error: {} });
    };

    handleDiscard = event => {
        event.preventDefault();
        if (!this.props.event) {
            // case 1, adding event, reset form to default and close modal
            this.setState(this.deriveStateFrom(this.props));
            this.props.handleCloseModal();
        } else {
            // case 2, updating event, back to view mode
            this.props.setViewMode();
        }
    };

    render() {
        const { handleCloseModal } = this.props;
        const {
            title,
            location,
            description,
            start,
            end,
            weekday,
            headerColor,
            isWaitingApi,
            error
        } = this.state;

        const headerStyle = { backgroundColor: headerColor };

        return (
            <form className="event-form edit" onSubmit={this.handleSubmit}>
                <div className="header" style={headerStyle}>
                    <div className="content">
                        <HeaderTextField
                            required
                            id="title"
                            label="Title"
                            value={title}
                            onChange={this.handleChange("title")}
                            margin="none"
                            error={!!error.title}
                            helperText={error.title}
                        />
                    </div>
                </div>

                <div className="body">
                    <div className="event-info">
                        <div className="time-picker">
                            <BodyTextField
                                required
                                type="time"
                                id="start"
                                label="Start"
                                value={start}
                                onChange={this.handleChange("start")}
                                margin="none"
                                inputProps={{ step: 300 }}
                                error={!!error.start}
                                helperText={error.start}
                            />
                            <BodyTextField
                                required
                                type="time"
                                id="end"
                                label="End"
                                value={end}
                                onChange={this.handleChange("end")}
                                margin="none"
                                inputProps={{ step: 300 }}
                                error={!!error.end}
                                helperText={error.end}
                            />
                            <BodyTextField
                                select
                                required
                                id="weekday"
                                label="Weekday"
                                margin="none"
                                value={weekday}
                                onChange={this.handleChange("weekday")}
                            >
                                {WEEK_DAYS.map((weekday, i) => (
                                    <MenuItem
                                        key={i}
                                        value={i}
                                        style={{ fontSize: 14 }}
                                    >
                                        {weekday}
                                    </MenuItem>
                                ))}
                            </BodyTextField>
                        </div>
                        <div className="location-textfield">
                            <BodyTextField
                                fullWidth
                                id="location"
                                label="Location"
                                value={location}
                                onChange={this.handleChange("location")}
                                margin="normal"
                            />
                        </div>
                        <div className="description-textfield">
                            <BodyTextField
                                multiline
                                fullWidth
                                id="description"
                                label="Description"
                                value={description}
                                onChange={this.handleChange("description")}
                                rows="3"
                                margin="normal"
                            />
                        </div>

                        <div className="color-picker">
                            <span className="color-picker-indicater">
                                Color *
                            </span>
                            <TwitterPicker
                                triangle={"hide"}
                                width={"348px"}
                                color={headerColor}
                                colors={COLOR_CHOICES}
                                onChangeComplete={this.handleColorChange}
                            />
                        </div>
                    </div>

                    <div className="buttons-bar">
                        <StyledButton
                            onClick={this.handleDiscard}
                            disabled={isWaitingApi}
                        >
                            Discard
                        </StyledButton>
                        <StyledButton
                            type="submit"
                            color="primary"
                            disabled={isWaitingApi}
                        >
                            {isWaitingApi ? "Waiting API..." : "Confirm"}
                        </StyledButton>
                    </div>
                </div>

                <a href="#0" className="close" onClick={handleCloseModal}>
                    Close
                </a>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    isUserLoggedIn: state.User.isUserLoggedIn,
    events: state.Event.events
});

const mapDispatchToProps = { addEvent, updateEvent, setError };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventFormEditMode);
