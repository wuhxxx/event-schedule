import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LoginModal from "./LoginModal.js";
import { RESET_FORM, SIGNIN_FORM, SIGNUP_FORM } from "../../constants";
import { logUserOut } from "../../actions/userActions.js";
import { toast } from "react-toastify";
import classTogglerBuilder from "../../utils/classTogglerBuilder.js";

import logo from "../../assets/images/cd-logo.svg";
import "../../styles/TopBar.css";

class TopBar extends Component {
    static propTypes = {
        logUserOut: PropTypes.func,
        isUserLoggedIn: PropTypes.bool,
        username: PropTypes.string
    };

    state = {
        isNavListVisible: false,
        isModalOpen: false,
        formToOpen: SIGNIN_FORM
    };

    // if width of web page is more than 768px,
    // nav's child node ul will overlap nav,
    // at this time, click's event.target is ul.
    // Only set state to toggle li open/close when in mobile
    navClickHandler = event => {
        event.preventDefault();
        event.stopPropagation();
        // check event target's tagName, only set state when it's "NAV"
        if (event.target.tagName === "NAV") {
            this.setState(prevState => ({
                isNavListVisible: !prevState.isNavListVisible
            }));
        }
    };

    // open modal with specific form
    openModalWithForm = formToOpen => event => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        // make sure formToOpen is one of three pre-defined forms
        if (
            formToOpen === RESET_FORM ||
            formToOpen === SIGNIN_FORM ||
            formToOpen === SIGNUP_FORM
        )
            this.setState({ isModalOpen: true, formToOpen });
        else return;
    };

    closeModal = event => {
        if (event) event.preventDefault();
        this.setState({ isModalOpen: false });
    };

    logoutClickHandler = event => {
        event.stopPropagation();
        event.preventDefault();
        toast.info("👋 See ya~");
        this.props.logUserOut();
    };

    toggleNavListClassBy = classTogglerBuilder(
        "cd-main-nav__list",
        "cd-main-nav__list--is-visible"
    );

    render() {
        let navListClass = this.toggleNavListClassBy(
            this.state.isNavListVisible
        );
        return (
            <div>
                <header className="cd-main-header">
                    <div className="cd-main-header__logo">
                        <img src={logo} alt="Logo" />
                        <span className="header-title">Event Schedule</span>
                    </div>

                    <nav className="cd-main-nav" onClick={this.navClickHandler}>
                        <ul className={navListClass}>
                            <li>
                                {this.props.isUserLoggedIn ? (
                                    <span
                                        className="cd-main-nav__item top-bar-nav--welcome-msg"
                                        href="#0"
                                    >
                                        {`Hi there, ${this.props.username}`}
                                    </span>
                                ) : (
                                    <a
                                        className="cd-main-nav__item cd-main-nav__item--signin"
                                        href="#0"
                                        onClick={this.openModalWithForm(
                                            SIGNIN_FORM
                                        )}
                                    >
                                        Sign in
                                    </a>
                                )}
                            </li>
                            <li>
                                {this.props.isUserLoggedIn ? (
                                    <a
                                        className="cd-main-nav__item top-bar-nav__item--logout"
                                        href="#0"
                                        onClick={this.logoutClickHandler}
                                    >
                                        Log out
                                    </a>
                                ) : (
                                    <a
                                        className="cd-main-nav__item cd-main-nav__item--signup"
                                        href="#0"
                                        onClick={this.openModalWithForm(
                                            SIGNUP_FORM
                                        )}
                                    >
                                        Sign up
                                    </a>
                                )}
                            </li>
                        </ul>
                    </nav>
                </header>
                {/* if simply mount and unmout modal according to state, 
                there will be no animation for modal */}
                <LoginModal
                    isModalOpen={this.state.isModalOpen}
                    formToOpen={this.state.formToOpen}
                    closeModal={this.closeModal}
                    openModalWithForm={this.openModalWithForm}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isUserLoggedIn: state.User.isUserLoggedIn,
        username: state.User.username
    };
};

export default connect(
    mapStateToProps,
    { logUserOut }
)(TopBar);
