import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import classTogglerBuilder from "../../utils/classTogglerBuilder.js";
import { userFormInputValidators } from "../../utils/validators.js";
import { connect } from "react-redux";
import { signUserIn } from "../../actions/userActions.js";
import {
    USERNAME,
    USERNAME_ERROR,
    EMAIL,
    EMAIL_ERROR,
    PASSWORD,
    PASSWORD_ERROR,
    USER_API_ROUTE,
    USER_ERRORS
} from "../../constants";

import "../../styles/UserForm.css";

const terms =
    "Terms: Your data won't be permanently preserved in the database since this is a demo website, the database periodically cleans up each week. You may want to signup again after that.";

const termsCloseDelayOnHover = 200;
const termsNoticeCloseDelay = 1000;

class SignupForm extends Component {
    static propTypes = {
        closeModal: PropTypes.func,
        signUserIn: PropTypes.func.isRequired
    };

    initialState = {
        isPasswordHidden: true,
        isTermsShown: false,
        [USERNAME]: "",
        [USERNAME_ERROR]: "",
        [EMAIL]: "",
        [EMAIL_ERROR]: "",
        [PASSWORD]: "",
        [PASSWORD_ERROR]: "",
        isWaitingApi: false
    };

    state = { ...this.initialState };

    handleInputValueChange = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // validate input and get error object
        const err = userFormInputValidators[name](value);
        this.setState({
            ...err,
            [name]: value
        });
    };

    toggleHidePassword = event => {
        event.preventDefault();
        event.stopPropagation();
        this.setState(prevState => ({
            isPasswordHidden: !prevState.isPasswordHidden
        }));
    };

    toggleInputClassBy = classTogglerBuilder(
        "cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding cd-signin-modal__input--has-border",
        "cd-signin-modal__input--has-error"
    );

    toggleSpanClassBy = classTogglerBuilder(
        "cd-signin-modal__error",
        "cd-signin-modal__error--is-visible"
    );

    toggleTermsDetailsClassBy = classTogglerBuilder(
        "signup-form-terms-detail",
        "signup-form-terms-detail--is-visible"
    );

    handleSubmit = event => {
        event.preventDefault();
        // check if required field is empty
        const fields = [USERNAME, EMAIL, PASSWORD];
        const errorFields = [USERNAME_ERROR, EMAIL_ERROR, PASSWORD_ERROR];
        const newUser = {};
        for (let i = 0; i < fields.length; i++) {
            let input = this.state[fields[i]];
            if (!input) {
                return this.setState({
                    [errorFields[i]]: "This field is required"
                });
            }
            newUser[fields[i]] = input;
        }
        // check box
        if (!this.checkBox.checked) {
            this.setState({ isTermsShown: true });
            return setTimeout(() => {
                this.setState({ isTermsShown: false });
            }, termsNoticeCloseDelay);
        }
        // set state to indicate waiting api response
        this.setState({ isWaitingApi: true });
        // make a request to api
        axios
            .post(`${USER_API_ROUTE}/signup`, newUser)
            .then(res => {
                // reset state then close modal
                this.setState({ ...this.initialState });
                this.props.closeModal();
                toast.info("🎉 You are logged in!");
                // dispatch signin action, remember user by default
                this.props.signUserIn(res.data.data, true);
            })
            .catch(err => {
                this.setState({ isWaitingApi: false });
                if (err.response) {
                    const errorRes = err.response.data.error;
                    console.log(errorRes);
                    if (errorRes.name === USER_ERRORS.EmailRegistered) {
                        this.setState({
                            [EMAIL_ERROR]:
                                "This email has been registered, use a different email address"
                        });
                    }
                } else {
                    // network error
                    console.log(err);
                    toast.warn("😱 Connection to server failed");
                }
            });
    };

    render() {
        const usernameValue = this.state[USERNAME],
            usernameError = this.state[USERNAME_ERROR],
            emailValue = this.state[EMAIL],
            emailError = this.state[EMAIL_ERROR],
            passwordValue = this.state[PASSWORD],
            passwordError = this.state[PASSWORD_ERROR];
        const { isPasswordHidden, isWaitingApi } = this.state;
        return (
            <form
                className="cd-signin-modal__form"
                onSubmit={this.handleSubmit}
            >
                <p className="cd-signin-modal__fieldset">
                    <label
                        className="cd-signin-modal__label cd-signin-modal__label--username cd-signin-modal__label--image-replace"
                        htmlFor="signup-username"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Username"
                        name={USERNAME}
                        value={usernameValue}
                        onChange={this.handleInputValueChange}
                        className={this.toggleInputClassBy(usernameError)}
                    />
                    <span className={this.toggleSpanClassBy(usernameError)}>
                        {usernameError}
                    </span>
                </p>

                <p className="cd-signin-modal__fieldset">
                    <label
                        className="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
                        htmlFor="signup-email"
                    >
                        E-mail
                    </label>
                    <input
                        id="signup-email"
                        type="email"
                        placeholder="E-mail"
                        name={EMAIL}
                        value={emailValue}
                        onChange={this.handleInputValueChange}
                        className={this.toggleInputClassBy(emailError)}
                    />
                    <span className={this.toggleSpanClassBy(emailError)}>
                        {emailError}
                    </span>
                </p>

                <p className="cd-signin-modal__fieldset">
                    <label
                        className="cd-signin-modal__label cd-signin-modal__label--password cd-signin-modal__label--image-replace"
                        htmlFor="signup-password"
                    >
                        Password
                    </label>
                    <input
                        id="signup-password"
                        placeholder="Password"
                        name={PASSWORD}
                        value={passwordValue}
                        onChange={this.handleInputValueChange}
                        type={isPasswordHidden ? "password" : "text"}
                        className={this.toggleInputClassBy(passwordError)}
                    />
                    <a
                        href="#0"
                        className="cd-signin-modal__hide-password js-hide-password"
                        onClick={this.toggleHidePassword}
                    >
                        {isPasswordHidden ? "Show" : "Hide"}
                    </a>
                    <span className={this.toggleSpanClassBy(passwordError)}>
                        {passwordError}
                    </span>
                </p>

                <p className="cd-signin-modal__fieldset">
                    <input
                        type="checkbox"
                        id="accept-terms"
                        className="cd-signin-modal__input"
                        ref={ele => (this.checkBox = ele)}
                    />
                    <label
                        htmlFor="accept-terms"
                        className="checkBox-label"
                        ref={ele => (this.lable = ele)}
                    >
                        I agree to the{" "}
                        <span
                            className="signup-form-terms"
                            onMouseOver={() => {
                                this.setState({ isTermsShown: true });
                            }}
                            onMouseOut={() => {
                                setTimeout(() => {
                                    this.setState({ isTermsShown: false });
                                }, termsCloseDelayOnHover);
                            }}
                        >
                            Terms
                        </span>
                    </label>
                    <span
                        className={this.toggleTermsDetailsClassBy(
                            this.state.isTermsShown
                        )}
                    >
                        {terms}
                    </span>
                </p>

                <p className="cd-signin-modal__fieldset">
                    <input
                        className="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding"
                        type="submit"
                        disabled={isWaitingApi}
                        value={
                            this.state.isWaitingApi
                                ? "Waiting response..."
                                : "Create account"
                        }
                    />
                </p>
            </form>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { signUserIn };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupForm);
