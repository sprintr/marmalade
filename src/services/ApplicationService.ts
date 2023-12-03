import Application, { Status } from "../models/Application";

import ApplicationRepository from "../repositories/ApplicationRepository";

import {
	getRandomUuid,
	getRandomSecret,
} from "../utils/ApplicationUtils";
import {
	getPagination
} from "../utils/PaginationUtils";

export default class ApplicationService {
	applicationRepository: ApplicationRepository;

	constructor(applicationRepository: ApplicationRepository) {
		this.applicationRepository = applicationRepository;
	}

	/**
	 * Creates an application
	 */
	async createApplication(
		requestBody: {
			name: string;
			homepage?: string;
			description?: string;
		},
	): Promise<Application> {
		const newRequestBody = {
			...requestBody,
			clientId: getRandomUuid(),
			clientSecret: getRandomSecret(),
			clientCredentialsUpdatedAt: new Date(),
			status: Status.Active,
		};

		const application = await this.applicationRepository.create(newRequestBody);
		if (!application) {
			throw "Failed to create the application";
		}
		return application;
	}

	/**
	 * Returns an application by its id
	 */
	getApplication(id: number): Promise<Application | null> {
		return this.applicationRepository.findById(id);
	}

	/**
	 * Returns an application by its client id
	 */
	getApplicationByClientId(clientId: string): Promise<Application | null> {
		return this.applicationRepository.findByClientId(clientId);
	}

	/**
	 * Returns a list of applications
	 */
	getAllApplications(
		filters: Record<string, string>,
		orderBy: string,
		pageNumber: number,
		itemsPerPage: number,
	): Promise<Application[]> {
		const { offset, limit } = getPagination(pageNumber, itemsPerPage);
		return this.applicationRepository.findAll(orderBy, offset, limit);
	}

	/**
	 * Updates an application
	 */
	updateApplication(
		id: number,
		requestBody: {
			name: string;
			homepage: string;
			description: string;
		},
	): Promise<Application | null> {
		return this.applicationRepository.updateById(id, requestBody);
	}

	/**
	 * Updates an application's client credentials
	 */
	updateApplicationCredentials(id: number): Promise<Application | null> {
		const requestBody = {
			clientId: getRandomUuid(),
			clientSecret: getRandomSecret(),
			clientCredentialsUpdatedAt: new Date(),
		};
		return this.applicationRepository.updateCredentialsById(id, requestBody);
	}

	/**
	 * Updates an application's status
	 */
	updateApplicationStatus(
		id: number,
		requestBody: {
			status: Status;
		},
	): Promise<Application | null> {
		return this.applicationRepository.updateStatusById(id, requestBody);
	}

	/**
	 * Deletes an application
	 */
	deleteApplication(id: number): Promise<number> {
		return this.applicationRepository.deleteById(id);
	}
}
