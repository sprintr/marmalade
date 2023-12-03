import { Validator } from "node-input-validator";

import User from "../models/User";

import { Status } from "../models/Application";

import ApplicationRepository from "../repositories/ApplicationRepository";

/**
 * List of valid status values
 */
const validStatuses: Record<string, Status> = {
	"Active": Status.Active,
	"Inactive": Status.Inactive,
	"Banned": Status.Banned,
};

export default class ApplicationValidator {
	applicationRepository: ApplicationRepository;

	constructor(applicationRepository: ApplicationRepository) {
		this.applicationRepository = applicationRepository;
	}

	/**
	 * Validates creating an application
	 *
	 * @param auth
	 * @param requestBody
	 */
	async validateCreateApplication(
		auth: {
			user: User,
		},
		requestBody: {
			name: string;
			homepage?: string;
			description?: string;
			status?: Status;
		},
	): Promise<{
		isOk: boolean;
		errors: Record<string, string>;
		toString: () => string;
	}> {
		const response = {
			isOk: true,
			errors: {},
			toString: function () {
				return JSON.stringify(this.errors);
			},
		};

		// Validate the input
		const validator = new Validator(requestBody, {
			name: 'required|minLength:1|maxLength:128',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				name: validator?.errors?.name?.message,
			};
			return response;
		}

		// Make sure the applicationId has a valid status if one is provided.
		if (requestBody.status && !validStatuses[requestBody.status]) {
			response.isOk = false;
			response.errors = {
				status: "Please select a valid status",
			};
			return response;
		}

		return response;
	}

	/**
	 * Validates updating an application
	 *
	 * @param auth
	 * @param applicationId
	 * @param requestBody
	 * @returns
	 */
	async validateUpdateApplication(
		auth: {
			user: User,
		},
		applicationId: number,
		requestBody: {
			name: string;
			homepage: string;
			description: string;
		},
	): Promise<{
		isOk: boolean;
		errors: Record<string, string>;
		toString: () => string;
	}> {
		const response = {
			isOk: true,
			errors: {},
			toString: function () {
				return JSON.stringify(this.errors);
			},
		};

		// Validate the input
		const validator = new Validator(requestBody, {
			name: 'required|minLength:1|maxLength:128',
			homepage: 'maxLength:128',
			description: 'maxLength:128',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				name: validator?.errors?.name?.message,
				homepage: validator?.errors?.homepage?.message,
				description: validator?.errors?.description?.message,
			};
			return response;
		}

		// Make sure the application exists.
		const application = await this.applicationRepository.findById(applicationId);
		if (!application) {
			response.isOk = false;
			response.errors = {
				application: "Failed to find the application.",
			};
			return response;
		}

		return response;
	}
}
