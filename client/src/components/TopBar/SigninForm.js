import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { signUserIn } from "../../actions/userActions.js";
import classTogglerBuilder from "../../utils/classTogglerBuilder.js";
import { userFormInputValidators } from "../../utils/validators.js";
import {
    EMAIL,
    EMAIL_ERROR,
    PASSWORD,
    PASSWORD_ERROR,
    USER_API_ROUTE,
    USER_ERRORS
} from "../../constants";

import "../../styles/UserForm.css";

class SigninForm extends Component {
    static propTypes = {
        closeModal: PropTypes.func,
        signUserIn: PropTypes.func
    };

    state = {
        isPasswordHidden: true,
        [EMAIL]: "",
        [EMAIL_ERROR]: "",
        [PASSWORD]: "",
        [PASSWORD_ERROR]: "",
        isWaitingApi: false
    };

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

    handleSubmit = event => {
        event.preventDefault();
        // check if required field is empty
        const fields = [EMAIL, PASSWORD];
        const errorFields = [EMAIL_ERROR, PASSWORD_ERROR];
        const user = {};
        for (let i = 0; i < fields.length; i++) {
            let input = this.state[fields[i]];
            if (!input) {
                return this.setState({
                    [errorFields[i]]: "This field is required"
                });
            }
            user[fields[i]] = input;
        }
        // set state to indicate waiting api response
        this.setState({ isWaitingApi: true });
        // make a request to api
        axios
            .post(`${USER_API_ROUTE}/login`, user)
            .then(res => {
                this.setState({ isWaitingApi: false });
                this.props.closeModal();
                toast.info("🎉 You are logged in!");
                // dispatch signin action
                this.props.signUserIn(res.data.data, this.checkBox.checked);
            })
            .catch(err => {
                this.setState({ isWaitingApi: false });
                if (err.response) {
                    const errorRes = err.response.data.error;
                    console.log(errorRes);
                    if (errorRes.name === USER_ERRORS.UserNotFound) {
                        this.setState({
                            [EMAIL_ERROR]: "Cannot find account with this email"
                        });
                    }
                    if (errorRes.name === USER_ERRORS.WrongPassword) {
                        this.setState({
                            [PASSWORD_ERROR]: "Wrong password"
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
        const emailValue = this.state[EMAIL],
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
                        className="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
                        htmlFor="signin-email"
                    >
                        E-mail
                    </label>
                    <input
                        id="signin-email"
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
                        htmlFor="signin-password"
                    >
                        Password
                    </label>
                    <input
                        id="signin-password"
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
                        id="remember-me"
                        className="cd-signin-modal__input"
                        ref={ele => (this.checkBox = ele)}
                    />
                    <label htmlFor="remember-me" className="checkBox-label">
                        Remember me
                    </label>
                </p>

                <p className="cd-signin-modal__fieldset">
                    <input
                        className="cd-signin-modal__input cd-signin-modal__input--full-width"
                        type="submit"
                        disabled={isWaitingApi}
                        value={
                            this.state.isWaitingApi
                                ? "Waiting response..."
                                : "Login"
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
)(SigninForm);
