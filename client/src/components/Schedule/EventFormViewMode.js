import axios from "axios";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { toTimeString } from "../../utils/timeConverters.js";
import { toHexColor } from "../../utils/colorConverters.js";
import { DEFAULT_EVENT, EVENT_API_ROUTE } from "../../constants";
import { deleteEvents, setError } from "../../actions/eventActions.js";

import "../../styles/EventForm.css";

class EventFormViewMode extends Component {
    static propTypes = {
        event: PropTypes.object,
        setError: PropTypes.func.isRequired,
        setEditMode: PropTypes.func.isRequired,
        deleteEvents: PropTypes.func.isRequired,
        isUserLoggedIn: PropTypes.bool.isRequired,
        handleCloseModal: PropTypes.func.isRequired
    };

    state = { isWaitingApi: false };

    handleEditOnClick = event => {
        event.preventDefault();
        this.props.setEditMode();
    };

    handleDeleteOnClick = event => {
        event.preventDefault();
        const { deleteEvents, handleCloseModal, setError } = this.props;
        const idsToDel = this.props.event ? [this.props.event.eventId] : [];
        let promise;
        if (!this.props.isUserLoggedIn) {
            // no user logged in
            promise = Promise.resolve(idsToDel);
        } else {
            this.setState({ isWaitingApi: true });
            // call api
            promise = axios
                .delete(`${EVENT_API_ROUTE}`, { data: { eventIds: idsToDel } })
                .then(res => {
                    this.setState({ isWaitingApi: false });
                    return res.data.data.deletedEventsId;
                });
        }
        return promise
            .then(deletedEventsId => {
                console.log("Deleted events id: ", deletedEventsId);
                // dispatch delete events action
                deleteEvents(deletedEventsId);
                // close modal
                handleCloseModal();
                // emit toast
                toast("✂️ Event deleted!");
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

    render() {
        const { handleCloseModal } = this.props;
        const { isWaitingApi } = this.state;
        const event = this.props.event ? this.props.event : DEFAULT_EVENT;
        const { title, location, description, color, startAt, endAt } = event;
        const headerStyle = { backgroundColor: toHexColor(color) };

        return (
            <div className="event-form">
                <div className="header" style={headerStyle}>
                    <div className="content">
                        <span className="event-date">{`${toTimeString(
                            startAt
                        )} - ${toTimeString(endAt)}`}</span>
                        <h3 className="event-name">{title}</h3>
                    </div>
                </div>

                <div className="body">
                    <div className="event-info">
                        {location && (
                            <span className="event-location">{location}</span>
                        )}
                        <div className="event-description">{description}</div>
                    </div>
                    <div className="buttons-bar">
                        <IconButton
                            aria-label="Edit"
                            disabled={isWaitingApi}
                            style={{ marginLeft: 15 }}
                            onClick={this.handleEditOnClick}
                        >
                            <EditIcon style={{ width: 28, height: 28 }} />
                        </IconButton>
                        <IconButton
                            aria-label="Delete"
                            disabled={isWaitingApi}
                            style={{ marginLeft: 15 }}
                            onClick={this.handleDeleteOnClick}
                        >
                            <DeleteIcon style={{ width: 28, height: 28 }} />
                        </IconButton>
                    </div>
                </div>

                <a href="#0" className="close" onClick={handleCloseModal}>
                    Close
                </a>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isUserLoggedIn: state.User.isUserLoggedIn
});

const mapDispatchToProps = { deleteEvents, setError };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventFormViewMode);
