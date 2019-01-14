import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Timeline from "./Timeline.js";
import EventsGroup from "./EventsGroup.js";
import EventModal from "./EventModal.js";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { logUserOut } from "../../actions/userActions.js";
import { loadUserEvents, clearError } from "../../actions/eventActions.js";
import {
    TIMELINE_UNIT_DURATION,
    EVENT_SLOT_HEIGHT,
    DEFAULT_TO,
    DEFAULT_FROM,
    WEEK_DAYS,
    AUTH_ERRORS,
    EVENT_ERRORS
} from "../../constants";

import "../../styles/Schedule.css";

// styled material ui tooltip and fab
const StyledTooltip = withStyles({
    tooltip: { fontSize: 13 }
})(Tooltip);

const StyledFab = withStyles({
    root: {
        position: "fixed",
        right: "40px",
        bottom: "35px",
        zIndex: 2,
        width: "70px",
        height: "70px"
    }
})(Fab);

class Schedule extends Component {
    static propTypes = {
        error: PropTypes.object,
        events: PropTypes.array.isRequired,
        logUserOut: PropTypes.func.isRequired,
        clearError: PropTypes.func.isRequired,
        loadUserEvents: PropTypes.func.isRequired,
        isUserLoggedIn: PropTypes.bool.isRequired,
        isLoadingUserEvents: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isEditMode: false,
            eventToShowInModal: null,
            ...this.organizeEventsByWeekday(props.events)
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.events !== this.props.events) {
            // if events array changed, reorganize and set state
            this.setState(this.organizeEventsByWeekday(this.props.events));
        }
        if (this.props.error) {
            console.log(this.props.error);
            const { error } = this.props;
            if (error.code) {
                // handle http error response
                const errorName = error.name;
                if (AUTH_ERRORS[errorName]) {
                    let msg = "😅 Token expired, pls sign in again";
                    // jwt token lost, expired or invalid
                    if (errorName === AUTH_ERRORS.DeletedUser) {
                        // user is deleted
                        msg = "😅 Account deleted, pls sign up";
                    }
                    toast.warn(msg);
                    // sign out user
                    this.props.logUserOut();
                } else if (EVENT_ERRORS[errorName]) {
                    // event does not exist
                    toast.warn("😅 Event not found, reloading events");
                    // reload user events
                    this.props.loadUserEvents();
                }
            }
            // clear error
            this.props.clearError();
        }
    }

    // return a click handler which bind a specific event for <SingleEvent />
    openModalWithEvent = event => e => {
        e.preventDefault();
        this.setState({
            isModalOpen: true,
            isEditMode: false,
            eventToShowInModal: event
        });
    };

    setIsEditMode = (isEditMode = false) => {
        this.setState({ isEditMode });
    };

    closeModal = event => {
        if (event) event.preventDefault();
        this.setState({ isModalOpen: false });
    };

    addButtonClickHandler = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            isModalOpen: true,
            isEditMode: true,
            eventToShowInModal: null
        });
    };

    // Iterate through given events array and organize it to a 2-D array by weekday.
    // also compute the timeline's from and to
    organizeEventsByWeekday = events => {
        let timelineFrom = DEFAULT_FROM,
            timelineTo = DEFAULT_TO;
        const eventsByWeekday = [];
        for (let i = 0; i < WEEK_DAYS.length; i++) {
            eventsByWeekday[i] = [];
        }
        if (Array.isArray(events)) {
            // sort events by event's startAt
            events.sort((e1, e2) => e1.startAt - e2.startAt);
            // loop through events
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                let { weekday, startAt, endAt } = event;
                // update timeline from
                if (startAt < timelineFrom)
                    timelineFrom =
                        startAt <= 0
                            ? 0
                            : Math.floor(startAt / TIMELINE_UNIT_DURATION) *
                              TIMELINE_UNIT_DURATION;
                // update timeline to
                if (endAt > timelineTo)
                    timelineTo =
                        endAt >= 1440
                            ? 1440
                            : Math.ceil(endAt / TIMELINE_UNIT_DURATION) *
                              TIMELINE_UNIT_DURATION;
                // push event to corresponding weekday events array
                eventsByWeekday[weekday].push(event);
            }
        }

        // compute EventsGroup's events <ul> css height
        const eventsGroupUlHeight =
            Math.ceil((timelineTo - timelineFrom) / TIMELINE_UNIT_DURATION) *
            EVENT_SLOT_HEIGHT;

        return {
            eventsByWeekday,
            timelineFrom,
            timelineTo,
            eventsGroupUlHeight
        };
    };

    render() {
        const { isLoadingUserEvents } = this.props;
        const {
            isEditMode,
            isModalOpen,
            eventToShowInModal,
            eventsByWeekday,
            timelineFrom,
            timelineTo,
            eventsGroupUlHeight
        } = this.state;

        return (
            <div className="cd-schedule">
                {/* Loading spinner, conditional render */
                isLoadingUserEvents && (
                    <div className="progress-container">
                        <CircularProgress color="secondary" />
                        <div>Loading events...</div>
                    </div>
                )}
                {/* timeline, on the left of events grid */}
                <Timeline from={timelineFrom} to={timelineTo} />
                {/* events grid */}
                <div className="events">
                    <ul>
                        {WEEK_DAYS.map((WEEK_DAY, i) => (
                            <EventsGroup
                                key={i}
                                weekday={WEEK_DAY}
                                events={eventsByWeekday[i]}
                                timelineFrom={timelineFrom}
                                ulCSSHeight={eventsGroupUlHeight}
                                openModalWithEvent={this.openModalWithEvent}
                            />
                        ))}
                    </ul>
                </div>
                {/* Add event button, conditional render */
                !isLoadingUserEvents && (
                    <StyledTooltip
                        title="Add Event"
                        placement="top"
                        aria-label="Add Event"
                    >
                        <StyledFab
                            color="secondary"
                            aria-label="Add"
                            onClick={this.addButtonClickHandler}
                        >
                            <AddIcon
                                style={{ width: "30px", height: "30px" }}
                            />
                        </StyledFab>
                    </StyledTooltip>
                )}

                <EventModal
                    closeModal={this.closeModal}
                    isEditMode={isEditMode}
                    isModalOpen={isModalOpen}
                    eventToShow={eventToShowInModal}
                    setIsEditMode={this.setIsEditMode}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isUserLoggedIn: state.User.isUserLoggedIn,
        isLoadingUserEvents: state.Event.isLoadingUserEvents,
        events: state.Event.events,
        error: state.Event.error
    };
};

export default connect(
    mapStateToProps,
    { logUserOut, loadUserEvents, clearError }
)(Schedule);
