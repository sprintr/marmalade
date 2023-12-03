import { Validator } from "node-input-validator";

import UserRepository from "../repositories/UserRepository";

import { compare } from "../utils/AuthUtils";

/**
 * @see https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
 */
const REGEX_EMAIL = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export default class AuthValidator {
	userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Validate a sign up request
	 */
	async validateSignUp(
		requestBody: {
			name: string;
			emailAddress: string;
			password: string;
		}): Promise<{
			isOk: boolean;
			errors: Record<string, string>;
		}> {
		const response = {
			isOk: true,
			errors: {},
		};

		// Validate input
		const validator = new Validator(requestBody, {
			name: 'required|maxLength:64',
			emailAddress: 'required|maxLength:128',
			password: 'required|minLength:8|maxLength:32',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				name: validator?.errors?.name?.message,
				emailAddress: validator?.errors?.emailAddress?.message,
				password: validator?.errors?.password?.message,
			};
			return response;
		}

		// Make sure you've got a valid email address.
		if (!REGEX_EMAIL.test(requestBody.emailAddress)) {
			response.isOk = false;
			response.errors = {
				emailAddress: "Please enter a valid email address.",
			};
			return response;
		}

		// Check if the user has already been signed up
		const user = await this.userRepository.findByEmailAddress(requestBody.emailAddress);
		if (user) {
			response.isOk = false;
			response.errors = {
				emailAddress: "This email address is not available. Please enter a different email address.",
			};
			return response;
		}

		return response;
	}

	/**
	 * Validate a sign in request
	 */
	async validateSignIn(
		requestBody: {
			emailAddress: string;
			password: string;
		}): Promise<{
			isOk: boolean;
			errors: Record<string, string>;
		}> {
		const response = {
			isOk: true,
			errors: {},
		};

		// Validate the input
		const validator = new Validator(requestBody, {
			emailAddress: 'required|maxLength:128',
			password: 'required|minLength:8|maxLength:32',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				emailAddress: validator?.errors?.emailAddress?.message,
				password: validator?.errors?.password?.message,
			};
			return response;
		}

		// Make sure you've got a valid email address.
		if (!REGEX_EMAIL.test(requestBody.emailAddress)) {
			response.isOk = false;
			response.errors = {
				emailAddress: "Please enter a valid email address.",
			};
			return response;
		}

		// Check if the user exists.
		const user = await this.userRepository.findByEmailAddress(requestBody.emailAddress);
		if (!user) {
			response.isOk = false;
			response.errors = {
				emailAddress: "Sorry, we could not find this account.",
			};
			return response;
		}

		// Make sure the password matches.
		if (!compare(requestBody.password, user.password)) {
			response.isOk = false;
			response.errors = {
				emailAddress: "Sorry, we could not find this account.",
			};
			return response;
		}

		return response;
	}
}
