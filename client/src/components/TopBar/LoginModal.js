import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { SIGNIN_FORM, RESET_FORM, SIGNUP_FORM } from "../../constants";
import SigninForm from "./SigninForm.js";
import SignupForm from "./SignupForm.js";
import ResetForm from "./ResetForm.js";
import "../../styles/LoginModal.css";

// login modal root in index.html
const loginModalRoot = document.getElementById("login-modal-root");

// ESC key code
const ESC_KEY = 27;

export default class LoginModal extends Component {
    // prop types
    static propTypes = {
        isModalOpen: PropTypes.bool,
        formToOpen: PropTypes.string,
        closeModal: PropTypes.func,
        openModalWithForm: PropTypes.func
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

    componentWillUnmount() {
        // remove event listener
        document.removeEventListener("keydown", this.escKeyDownHandler);
    }

    render() {
        const {
            isModalOpen,
            formToOpen,
            closeModal,
            openModalWithForm
        } = this.props;

        // enums object for conditional rendering forms
        const userForms = {
            [RESET_FORM]: <ResetForm closeModal={this.props.closeModal} />,
            [SIGNIN_FORM]: <SigninForm closeModal={this.props.closeModal} />,
            [SIGNUP_FORM]: <SignupForm closeModal={this.props.closeModal} />
        };

        // enums object for conditional rendering bottom links
        const bottomLinks = {
            [RESET_FORM]: (
                <p className="cd-signin-modal__bottom-message">
                    <a href="#0" onClick={openModalWithForm(SIGNIN_FORM)}>
                        Back to log-in
                    </a>
                </p>
            ),
            [SIGNIN_FORM]: (
                <p className="cd-signin-modal__bottom-message">
                    <a href="#0" onClick={openModalWithForm(RESET_FORM)}>
                        reset account
                    </a>
                </p>
            ),
            [SIGNUP_FORM]: null
        };

        return ReactDOM.createPortal(
            <div
                className={
                    isModalOpen
                        ? "cd-signin-modal cd-signin-modal--is-visible"
                        : "cd-signin-modal"
                }
            >
                {/* Cover Layer */}
                <div
                    data-iscoverlayer="true"
                    className="login-modal-cover-layer"
                    onClick={closeModal}
                />

                {/* Forms Container */}
                <div className="cd-signin-modal__container">
                    {/* Signin/Signup tabs */}
                    <ul className="cd-signin-modal__switcher js-signin-modal-switcher">
                        <li>
                            <a
                                href="#0"
                                onClick={openModalWithForm(SIGNIN_FORM)}
                                className={
                                    formToOpen !== SIGNUP_FORM
                                        ? "cd-selected"
                                        : ""
                                }
                            >
                                Sign in
                            </a>
                        </li>
                        <li>
                            <a
                                href="#0"
                                onClick={openModalWithForm(SIGNUP_FORM)}
                                className={
                                    formToOpen === SIGNUP_FORM
                                        ? "cd-selected"
                                        : ""
                                }
                            >
                                New account
                            </a>
                        </li>
                    </ul>
                    {/* user form block */}
                    <div className="cd-signin-modal__block cd-signin-modal__block--is-selected">
                        {// top message for reset form
                        formToOpen === RESET_FORM && (
                            <p className="cd-signin-modal__message">
                                Lost your password? Please enter your email
                                address. Your account will be reset.
                            </p>
                        )}
                        {userForms[formToOpen]}
                        {bottomLinks[formToOpen]}
                    </div>
                    {/* close modal anchor */}
                    <a
                        href="#0"
                        className="cd-signin-modal__close"
                        onClick={closeModal}
                    >
                        Close
                    </a>
                </div>
            </div>,
            loginModalRoot
        );
    }
}
