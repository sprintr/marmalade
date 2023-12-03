import type { OrderItem } from "sequelize";

import Application, { Status } from "../models/Application";

export default class ApplicationRepository {
	#orderByMap: { [key: string]: OrderItem[] } = {
		// ORDER BY id DESC
		desc: [['id', 'DESC']],

		// ORDER BY id ASC
		asc: [['id', 'ASC']],
	};

	/**
	 * Creates an application
	 */
	create(
		requestBody: {
			name: string;
			homepage?: string;
			description?: string;
			clientId: string;
			clientSecret: string;
			clientCredentialsUpdatedAt: Date;
			status?: Status;
		},
	): Promise<Application> {
		return Application.create({
			name: requestBody.name,
			homepage: requestBody.homepage,
			description: requestBody.description,
			clientId: requestBody.clientId,
			clientSecret: requestBody.clientSecret,
			clientCredentialsUpdatedAt: requestBody.clientCredentialsUpdatedAt,
			status: requestBody.status,
		});
	}

	/**
	 * Finds an application by its primary key
	 */
	findById(id: number): Promise<Application | null> {
		return Application.findByPk(id);
	}

	/**
	 * Finds an application by its client id
	 */
	findByClientId(clientId: string): Promise<Application | null> {
		return Application.findOne({
			where: {
				clientId: clientId,
			},
		});
	}

	/**
	 * Finds all applications
	 */
	findAll(orderBy: string, offset: number, limit: number): Promise<Application[]> {
		const order = this.#orderByMap[orderBy] ?? this.#orderByMap['desc'];

		return Application.findAll({
			order: order,
			offset: offset,
			limit: limit,
		});
	}

	/**
	 * Updates an application
	 */
	async updateById(
		id: number,
		requestBody: {
			name: string;
			homepage: string;
			description: string;
		},
	): Promise<Application | null> {
		const application = await Application.findByPk(id);
		if (application) {
			application.name = requestBody.name;
			application.homepage = requestBody.homepage;
			application.description = requestBody.description;
			return application.save();
		}
		return null;
	}

	/**
	 * Updates an application's credentials by its id
	 */
	async updateCredentialsById(
		id: number,
		requestBody: {
			clientId: string;
			clientSecret: string;
			clientCredentialsUpdatedAt: Date,
		},
	): Promise<Application | null> {
		const application = await Application.findByPk(id);
		if (application) {
			application.clientId = requestBody.clientId;
			application.clientSecret = requestBody.clientSecret;
			application.clientCredentialsUpdatedAt = requestBody.clientCredentialsUpdatedAt;
			return application.save();
		}
		return null;
	}

	/**
	 * Updates an application's status by its id
	 */
	async updateStatusById(
		id: number,
		requestBody: {
			status: Status;
		},
	): Promise<Application | null> {
		const application = await Application.findByPk(id);
		if (application) {
			application.status = requestBody.status;
			return application.save();
		}
		return null;
	}

	/**
	 * Deletes an application
	 */
	deleteById(id: number): Promise<number> {
		return Application.destroy({
			where: {
				id: id,
			},
			limit: 1,
		});
	}
}
