import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import EventFormEditMode from "./EventFormEditMode.js";
import EventFormViewMode from "./EventFormViewMode.js";

import "../../styles/EventModal.css";

// login modal root in index.html
const eventModalRoot = document.getElementById("event-modal-root");

// ESC key code
const ESC_KEY = 27;

class EventModal extends Component {
    static propTypes = {
        isEditMode: PropTypes.bool,
        eventToShow: PropTypes.object,
        closeModal: PropTypes.func.isRequired,
        isModalOpen: PropTypes.bool.isRequired,
        setIsEditMode: PropTypes.func.isRequired
    };

    escKeyDownHandler = event => {
        event.stopPropagation();
        if (this.props.isModalOpen && event.keyCode === ESC_KEY) {
            this.props.closeModal();
        }
    };

    componentDidMount() {
        // add event listener for esc key down
        document.addEventListener("keydown", this.escKeyDownHandler);
    }

    componentDidUpdate(prevProps) {
        const { isModalOpen, eventToShow } = this.props;
        // add class to selected event when modal opening
        // this makes selected event block hidden on desktop
        if (!prevProps.isModalOpen && isModalOpen && eventToShow) {
            document
                .getElementById(eventToShow.eventId)
                .classList.add("selected-event");
        }

        // remove class to selected event when modal closing
        if (prevProps.isModalOpen && !isModalOpen && prevProps.eventToShow) {
            const lastOpenEventId = prevProps.eventToShow.eventId;
            const eventBlockDOM = document.getElementById(lastOpenEventId);
            // event may be deleted
            if (eventBlockDOM) eventBlockDOM.classList.remove("selected-event");
        }
    }

    componentWillUnmount() {
        // remove event listener
        document.removeEventListener("keydown", this.escKeyDownHandler);
    }

    setViewMode = () => {
        this.props.setIsEditMode(false);
    };

    setEditMode = () => {
        this.props.setIsEditMode(true);
    };

    handleCloseModal = event => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.props.closeModal();
    };

    render() {
        const { isModalOpen, isEditMode, eventToShow } = this.props;

        return ReactDOM.createPortal(
            <div
                className={
                    isModalOpen ? "event-modal modal-is-visible" : "event-modal"
                }
            >
                <div className="cover-layer" onClick={this.handleCloseModal} />
                <div className="event-form_container">
                    {isEditMode ? (
                        <EventFormEditMode
                            event={eventToShow}
                            setViewMode={this.setViewMode}
                            handleCloseModal={this.handleCloseModal}
                        />
                    ) : (
                        <EventFormViewMode
                            event={eventToShow}
                            setEditMode={this.setEditMode}
                            handleCloseModal={this.handleCloseModal}
                        />
                    )}
                </div>
            </div>,
            eventModalRoot
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventModal);
