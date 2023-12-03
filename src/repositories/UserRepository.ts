import type { OrderItem } from "sequelize";

import User, { Role, Status } from "../models/User";

export default class UserRepository {
	#orderByMap: { [key: string]: OrderItem[], } = {
		// ORDER BY id DESC
		desc: [['id', 'DESC']],

		// ORDER BY id ASC
		asc: [['id', 'ASC']],
	};

	/**
	 * Creates a user
	 */
	create(
		requestBody: {
			name: string;
			emailAddress: string;
			password: string;
			role?: Role;
			status?: Status;
		},
	): Promise<User> {
		const user = new User();
		user.name = requestBody.name;
		user.emailAddress = requestBody.emailAddress;
		user.password = requestBody.password;
		user.role = requestBody.role;
		user.status = requestBody.status;
		return user.save();
	}

	/**
	 * Finds a user by their primary key
	 */
	findById(id: number): Promise<User | null> {
		return User.findByPk(id);
	}

	/**
	 * Finds a user by their email address
	 */
	findByEmailAddress(emailAddress: string): Promise<User | null> {
		return User.findOne({
			where: {
				emailAddress: emailAddress,
			},
		});
	}

	/**
	 * Finds all users
	 */
	findAll(orderBy: string, offset: number, limit: number): Promise<User[]> {
		const order = this.#orderByMap[orderBy] ?? this.#orderByMap.desc;

		return User.findAll({
			order: order,
			offset: offset,
			limit: limit,
		});
	}

	/**
	 * Finds all users by their assigned role
	 */
	findAllByRole(role: string, orderBy: string, offset: number, limit: number): Promise<User[]> {
		const order = this.#orderByMap[orderBy] ?? this.#orderByMap.desc;

		return User.findAll({
			where: {
				role: role,
			},
			order: order,
			offset: offset,
			limit: limit,
		});
	}

	/**
	 * Finds all users by their status
	 */
	findAllByStatus(status: string, orderBy: string, offset: number, limit: number): Promise<User[]> {
		const order = this.#orderByMap[orderBy] ?? this.#orderByMap.desc;

		return User.findAll({
			where: {
				status: status,
			},
			order: order,
			offset: offset,
			limit: limit,
		});
	}

	/**
	 * Updates a user by their id
	 */
	async updateById(
		id: number,
		requestBody: {
			name: string;
			emailAddress: string;
		},
	): Promise<User | null> {
		const user = await User.findByPk(id);
		if (user) {
			user.name = requestBody.name;
			user.emailAddress = requestBody.emailAddress;
			return user.save();
		}
		return null;
	}

	/**
	 * Update a user's password by their id
	 */
	async updatePasswordById(
		id: number,
		requestBody: {
			password: string;
		},
	): Promise<User | null> {
		const user = await User.findByPk(id);
		if (user) {
			user.password = requestBody.password;
			return user.save();
		}
		return null;
	}

	/**
	 * Updates a user's role by their id
	 */
	async updateRoleById(
		id: number,
		requestBody: {
			role: Role;
		},
	): Promise<User | null> {
		const user = await User.findByPk(id);
		if (user) {
			user.role = requestBody.role;
			return user.save();
		}
		return null;
	}

	/**
	 * Updates a user's status by their id
	 */
	async updateStatusById(
		id: number,
		requestBody: {
			status: Status;
		},
	): Promise<User | null> {
		const user = await User.findByPk(id);
		if (user) {
			user.status = requestBody.status;
			return user.save();
		}
		return null;
	}

	/**
	 * Deletes a user by their id
	 */
	deleteById(id: number): Promise<number> {
		return User.destroy({
			where: {
				id: id,
			},
			limit: 1,
		});
	}
}
