import { Validator } from "node-input-validator";

import User, {
	Role,
	Status,
} from "../models/User";

import UserRepository from "../repositories/UserRepository";

/**
 * List of valid role values
 */
const validRoles: Record<string, Role> = {
	"SuperAdmin": Role.SuperAdmin,
	"StaffAdmin": Role.StaffAdmin,
	"ManagerAdmin": Role.ManagerAdmin,
};

/**
 * List of valid status values
 */
const validStatuses: Record<string, Status> = {
	"Active": Status.Active,
	"Inactive": Status.Inactive,
	"Banned": Status.Banned,
};

export default class UserValidator {
	userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Validates creating a user
	 *
	 * @param auth
	 * @param requestBody
	 * @returns
	 */
	async validateCreateUser(
		auth: {
			user: User,
		},
		requestBody: {
			name: string;
			emailAddress: string;
			password: string;
			role?: string;
			status?: string;
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
			emailAddress: 'required|maxLength:128',
			password: 'required|minLength:8|maxLength:128',
			role: 'maxLength:64',
			status: 'maxLength:64',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				name: validator?.errors?.name?.message,
				emailAddress: validator?.errors?.emailAddress?.message,
				password: validator?.errors?.password?.message,
				role: validator?.errors?.password?.message,
				status: validator?.errors?.status?.message,
			};
			return response;
		}

		// Make sure the user has a valid role if one is provided.
		if (requestBody.role && !validRoles[requestBody.role]) {
			response.isOk = false;
			response.errors = {
				role: "Please select a valid role",
			};
			return response;
		}

		// Make sure the user has a valid status if one is provided.
		if (requestBody.status && !validStatuses[requestBody.status]) {
			response.isOk = false;
			response.errors = {
				status: "Please select a valid status",
			};
			return response;
		}

		// Check if the user exists.
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
	 * Validates retrieving users
	 */
	async validateGetUsers(
		auth: {
			user: User,
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
		return response;
	}

	/**
	 * Validates retrieving a user
	 */
	async validateGetUser(
		auth: {
			user: User,
		},
		userId: number,
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
		return response;
	}

	/**
	 * Validates updating a user
	 */
	async validateUpdateUser(
		auth: {
			user: User,
		},
		userId: number,
		requestBody: {
			name: string;
			emailAddress: string;
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
			emailAddress: 'required|maxLength:128',
		});

		if (!await validator.check()) {
			response.isOk = false;
			response.errors = {
				name: validator?.errors?.name?.message,
				emailAddress: validator?.errors?.emailAddress?.message,
			};
			return response;
		}

		// Check if the email address is available.
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
	 * Validates updating user's password
	 */
	async validateUpdateUserPassword(
		auth: {
			user: User,
		},
		userId: number,
		requestBody: {
			oldPassword: string;
			newPassword: string;
			confirmPassword: string;
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
		return response;
	}

	/**
	 * Validates updating user's role
	 */
	async validateUpdateUserRole(
		auth: {
			user: User,
		},
		userId: number,
		requestBody: {
			role: string;
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

		// Make sure the user has a valid role.
		if (!validRoles[requestBody.role]) {
			response.isOk = false;
			response.errors = {
				role: "Please select a valid role",
			};
			return response;
		}

		return response;
	}

	/**
	 * Validates updating user's status
	 */
	async validateUpdateUserStatus(
		auth: {
			user: User,
		},
		userId: number,
		requestBody: {
			status: string;
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

		// Make sure the user has a valid status.
		if (!validStatuses[requestBody.status]) {
			response.isOk = false;
			response.errors = {
				status: "Please select a valid status",
			};
			return response;
		}

		return response;
	}

	/**
	 * Validates deleting a users
	 */
	async validateDeleteUser(
		auth: {
			user: User,
		},
		userId: number,
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
		return response;
	}
}
