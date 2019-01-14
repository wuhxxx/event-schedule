import React from "react";
import PropTypes from "prop-types";
import { toTimeString } from "../../utils/timeConverters.js";
import { toHexColor } from "../../utils/colorConverters.js";
import {
    EVENT_SLOT_HEIGHT,
    TIMELINE_UNIT_DURATION,
    MIN_DURATION_TO_RENDER_TIME,
    MIN_DURATION_TO_RENDER_TITLE
} from "../../constants";

import "../../styles/SingleEvent.css";

function SingleEvent(props) {
    const { event, timelineFrom, isOnDesktop, openModal } = props;
    const { eventId, title, color, startAt, endAt } = event;

    // set event block's color
    const liStyle = { backgroundColor: toHexColor(color) };

    let ifToRenderTime = true,
        ifToRenderTitle = true;
    let aStyle = null,
        emStyle = null;
    if (isOnDesktop) {
        // event duration, used to determine if to render event time and title
        const duration = endAt - startAt;
        // place event on a proper position of grid when render on desktop
        const eventTop =
            (EVENT_SLOT_HEIGHT * (startAt - timelineFrom)) /
            TIMELINE_UNIT_DURATION;
        const eventHeight =
            (EVENT_SLOT_HEIGHT * duration) / TIMELINE_UNIT_DURATION;

        // set top and height for event block
        liStyle.top = `${eventTop - 1}px`;
        liStyle.height = `${eventHeight + 1}px`;

        // decide if to render time and title
        ifToRenderTime = duration >= MIN_DURATION_TO_RENDER_TIME;
        ifToRenderTitle = duration >= MIN_DURATION_TO_RENDER_TITLE;

        // do a little extra CSS work when only render event title:
        //     vertical center event title in event block!
        if (!ifToRenderTime && ifToRenderTitle) {
            emStyle = { lineHeight: liStyle.height };
            aStyle = {
                paddingTop: "0em",
                paddingBottom: "0em"
            };
        }
    }

    return (
        <li id={eventId} className="single-event" style={liStyle}>
            <a href="#0" onClick={openModal} style={aStyle}>
                {ifToRenderTime && (
                    <span className="event-date">
                        {`${toTimeString(startAt)} - ${toTimeString(endAt)}`}
                    </span>
                )}
                {ifToRenderTitle && (
                    <em className="event-name" style={emStyle}>
                        {title}
                    </em>
                )}
            </a>
        </li>
    );
}

SingleEvent.propTypes = {
    event: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
    timelineFrom: PropTypes.number.isRequired,
    isOnDesktop: PropTypes.bool
};

export default SingleEvent;
