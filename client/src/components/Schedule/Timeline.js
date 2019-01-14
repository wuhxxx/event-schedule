import React from "react";
import PropTypes from "prop-types";
import { toTimeString } from "../../utils/timeConverters.js";
import { TIMELINE_UNIT_DURATION } from "../../constants";
import "../../styles/Timeline.css";

// Timeline of Schedule
function Timeline(props) {
    const { from, to } = props;
    // each element in timelist represents a vertical line in events grid
    const timeList = [];
    for (let time = from; time < to; time += TIMELINE_UNIT_DURATION) {
        timeList.push(
            <li key={time}>
                <span>{toTimeString(time)}</span>
            </li>
        );
    }
    return (
        <div className="timeline">
            <ul>{timeList}</ul>
        </div>
    );
}

// prop types
Timeline.propTypes = {
    from: PropTypes.number.isRequired,
    to: PropTypes.number.isRequired
};

export default Timeline;
