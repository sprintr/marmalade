import ApplicationRepository from '../repositories/ApplicationRepository';

export default class OAuthValidator {
	applicationRepository: ApplicationRepository;

	/**
	 * A list of supported grant types
	 */
	validGrantTypes = ['client_credentials'];

	constructor(applicationRepository: ApplicationRepository) {
		this.applicationRepository = applicationRepository;
	}

	/**
	 * Validate the credentials of the client when they're requesting an access token
	 */
	async validateGetAccessToken(
		requestBody: {
			client_id: string;
			client_secret: string;
			grant_type: string;
		}): Promise<{
			isOk: boolean,
			errors: Record<string, string>;
		}> {
		const response = {
			isOk: true,
			errors: {},
		};

		// Make sure the client has provided `grant_type`, `client_id` and `client_secret`
		if (!requestBody.grant_type || !requestBody.client_id || !requestBody.client_secret) {
			response.isOk = false;
			response.errors = {
				error: 'invalid_request',
				error_description: 'Invalid credentials provided. Please provide grant_type, client_id and client_secret',
			};
			return response;
		}

		// Make sure the user has provided a valid grant_type
		if (!this.validGrantTypes.includes(requestBody?.grant_type)) {
			response.isOk = false;
			response.errors = {
				error: 'unsupported_grant_type',
				error_description: 'Invalid grant type. Please use client_credentials as grant_type',
			};
			return response;
		}

		// Make sure the client application exists.
		const application = await this.applicationRepository.findByClientId(requestBody?.client_id);
		if (!application || application?.status === 'Inactive' || application?.status === 'Banned') {
			response.isOk = false;
			response.errors = {
				error: 'invalid_client',
				error_description: 'Invalid client. The client has been deleted, disabled or',
			};
			return response;
		}

		// Make sure the client secret matches.
		if (application?.clientSecret !== requestBody?.client_secret) {
			response.isOk = false;
			response.errors = {
				error: 'invalid_client',
				error_description: 'Failed to match the client secret',
			};
			return response;
		}

		return response;
	}
}
