

import User, { Role, Status, } from "../models/User";

import UserRepository from "../repositories/UserRepository";

import {
	hash,
} from "../utils/AuthUtils";
import {
	getPagination,
} from "../utils/PaginationUtils";

export default class UserService {
	userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Creates a user
	 */
	async createUser(
		requestBody: {
			name: string;
			emailAddress: string;
			password: string;
			role?: Role;
			status?: Status;
		},
	): Promise<User> {
		// Add default role.
		if (!requestBody?.role) {
			requestBody.role = Role.SuperAdmin;
		}

		// Add default status.
		if (!requestBody?.status) {
			requestBody.status = Status.Active;
		}

		// Hash the password.
		if (requestBody?.password) {
			requestBody.password = hash(requestBody.password);
		}

		const user = await this.userRepository.create(requestBody);
		if (!user) {
			throw "Failed to create the user";
		}
		return user;
	}

	/**
	 * Returns a user by their id
	 */
	getUser(id: number): Promise<User | null> {
		return this.userRepository.findById(id);
	}

	/**
	 * Returns a user by their email address
	 */
	getUserByEmailAddress(emailAddress: string): Promise<User | null> {
		return this.userRepository.findByEmailAddress(emailAddress);
	}

	/**
	 * Returns a list of users
	 */
	getAllUsers(
		filters: Record<string, string>,
		orderBy: string,
		pageNumber: number,
		itemsPerPage: number,
	): Promise<User[]> {
		const { offset, limit } = getPagination(pageNumber, itemsPerPage);

		if (filters?.role) {
			return this.userRepository.findAllByRole(filters.role, orderBy, offset, limit);
		} else if (filters?.status) {
			return this.userRepository.findAllByStatus(filters.status, orderBy, offset, limit);
		} else {
			return this.userRepository.findAll(orderBy, offset, limit);
		}
	}

	/**
	 * Updates the user
	 *
	 * @param id
	 * @param requestBody
	 * @returns
	 */
	updateUser(
		id: number,
		requestBody: {
			name: string;
			emailAddress: string;
		},
	): Promise<User | null> {
		return this.userRepository.updateById(id, requestBody);
	}

	/**
	 * Updates the users' password
	 */
	updateUserPassword(
		id: number,
		requestBody: {
			newPassword: string;
		},
	): Promise<User | null> {
		const newRequestBody = {
			password: hash(requestBody.newPassword),
		};
		return this.userRepository.updatePasswordById(id, newRequestBody);
	}

	/**
	 * Updates the user's role
	 */
	updateUserRole(
		id: number,
		requestBody: {
			role: Role;
		},
	): Promise<User | null> {
		return this.userRepository.updateRoleById(id, requestBody);
	}

	/**
	 * Updates the user's status
	 */
	updateUserStatus(
		id: number,
		requestBody: {
			status: Status;
		},
	): Promise<User | null> {
		return this.userRepository.updateStatusById(id, requestBody);
	}

	/**
	 * Deletes the user
	 */
	deleteUser(id: number): Promise<number> {
		return this.userRepository.deleteById(id);
	}
}
