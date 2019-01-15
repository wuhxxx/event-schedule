import React from "react";

import github from "../assets/images/github-brands.svg";
import "../styles/BottomInfo.css";

export default function BottomInfo() {
    return (
        <div className="bottom-info">
            <a
                href="https://github.com/wuhxxx/event-schedule"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src={github} alt="Github" className="github-logo" />
            </a>
            {/* <div className="github-logo">
                    <img src={github} alt="Github" />
                </div>

                <span className="repo-link">
                    <a
                        href="https://github.com/wuhxxx/event-schedule"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        event-schedule
                    </a>
                </span> */}
        </div>
    );
}
