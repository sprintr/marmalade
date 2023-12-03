import User, { Role, Status } from "../models/User";

import UserRepository from "../repositories/UserRepository";

import {
	hash,
} from "../utils/AuthUtils";
import {
	generateJwt,
} from "../utils/JwtUtils";

export default class AuthService {
	userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Sign up a user
	 */
	async signUp(
		requestBody: {
			name: string;
			emailAddress: string;
			password: string;
		},
	): Promise<{
		user: User;
		accessToken: string;
	}> {
		// Add default role.
		const newRequestBody = {
			...requestBody,
			password: hash(requestBody.password),
			role: Role.SuperAdmin,
			status: Status.Active,
		};

		const user = await this.userRepository.create(newRequestBody);
		if (!user) {
			throw "Failed to create the user";
		}

		// Generate an access token for the user.
		const accessToken = generateJwt({
			userId: user.id,
		}, user.name);
		if (!accessToken) {
			throw "Failed to generate access token for the user";
		}

		return {
			user: user,
			accessToken: accessToken,
		};
	}

	/**
	 * Sign in a user
	 */
	async signIn(
		requestBody: {
			emailAddress: string;
			password: string;
		},
	): Promise<{
		user: User;
		accessToken: string;
	}> {
		const user = await this.userRepository.findByEmailAddress(requestBody.emailAddress);
		if (!user) {
			throw "Failed to find the user";
		}

		// Generate an access token for the user.
		const accessToken = generateJwt({
			userId: user.id,
		}, user.name);
		if (!accessToken) {
			throw "Failed to generate access token for the user";
		}

		return {
			user: user,
			accessToken: accessToken,
		};
	}
}
