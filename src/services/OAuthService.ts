import ApplicationRepository from "../repositories/ApplicationRepository";

import Logger from "../utils/Logger";

import {
	generateJwt,
} from "../utils/JwtUtils";

export default class OAuthService {
	applicationRepository: ApplicationRepository;

	constructor(applicationRepository: ApplicationRepository) {
		this.applicationRepository = applicationRepository;
	}

	/**
	 * Returns the access token for the application
	 */
	async getAccessToken(
		requestBody: {
			client_id: string;
			client_secret: string;
		},
	): Promise<{
		access_token: string;
		token_type: string;
		expires_in: number;
	}> {
		const application = await this.applicationRepository.findByClientId(requestBody?.client_id);
		if (!application) {
			throw "Failed to find the application";
		}

		// Generate the access token for the application.
		const accessToken = generateJwt({
			clientId: application?.clientId,
		}, application?.name);
		if (!accessToken) {
			throw "Failed to generate an access token";
		}

		// Get the expires in time.
		let expiresIn = 0;
		try {
			expiresIn = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_SECONDS ?? '0');
		} catch (e) {
			Logger.error(e.toString());
		}

		return {
			token_type: 'Bearer',
			expires_in: expiresIn,
			access_token: accessToken,
		};
	}
}
