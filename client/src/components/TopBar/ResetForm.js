import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import classTogglerBuilder from "../../utils/classTogglerBuilder.js";
import { userFormInputValidators } from "../../utils/validators.js";
import {
    EMAIL,
    EMAIL_ERROR,
    USER_API_ROUTE,
    USER_ERRORS
} from "../../constants";

import "../../styles/UserForm.css";

class ResetForm extends Component {
    static propTypes = {
        closeModal: PropTypes.func
    };

    state = {
        [EMAIL]: "",
        [EMAIL_ERROR]: "",
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
        const emailInput = this.state[EMAIL];
        if (!emailInput) {
            return this.setState({
                [EMAIL_ERROR]: "This field is required"
            });
        }
        // set state to indicate waiting api response
        this.setState({ isWaitingApi: true });
        // make a request to api
        axios
            .delete(`${USER_API_ROUTE}`, { data: { email: emailInput } })
            .then(res => {
                this.setState({ isWaitingApi: false });
                this.props.closeModal();
                toast.warn("☠️ Account deleted!");
            })
            .catch(err => {
                this.setState({ isWaitingApi: false });
                if (err.response) {
                    const errorRes = err.response.data.error;
                    console.log(errorRes);
                    if (errorRes.name === USER_ERRORS.UserNotFound)
                        this.setState({
                            [EMAIL_ERROR]: "Cannot find account with this email"
                        });
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
            isWaitingApi = this.state.isWaitingApi;
        return (
            <form
                className="cd-signin-modal__form"
                onSubmit={this.handleSubmit}
            >
                <p className="cd-signin-modal__fieldset">
                    <label
                        className="cd-signin-modal__label cd-signin-modal__label--email cd-signin-modal__label--image-replace"
                        htmlFor="reset-email"
                    >
                        E-mail
                    </label>
                    <input
                        id="reset-email"
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
                    <input
                        className="cd-signin-modal__input cd-signin-modal__input--full-width cd-signin-modal__input--has-padding"
                        type="submit"
                        disabled={isWaitingApi}
                        // origin: value="Reset password"
                        value={
                            isWaitingApi
                                ? "Waiting response..."
                                : "Reset account"
                        }
                    />
                </p>
            </form>
        );
    }
}

export default ResetForm;
