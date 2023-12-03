import ApplicationRepository from "../../src/repositories/ApplicationRepository";

import ApplicationService from "../../src/services/ApplicationService";

import OAuthService from "../../src/services/OAuthService";

describe("OAuthService", () => {
	let applicationRepository: ApplicationRepository;

	let applicationService: ApplicationService;

	let oauthService: OAuthService;

	beforeAll(() => {
		applicationRepository = new ApplicationRepository();
		applicationService = new ApplicationService(applicationRepository);
		oauthService = new OAuthService(applicationRepository);
	});

	describe("getAccessToken", () => {
		it("should generate an access token for an application", async () => {
			// Create an application.
			const application = await applicationService.createApplication({
				name: "Peacock",
				homepage: "https://peacock.example.com",
				description: "This is an example application",
			});

			// Generate the secret.
			const token = await oauthService.getAccessToken({
				client_id: application.clientId,
				client_secret: application.clientSecret,
			});

			expect(token.token_type).toBe('Bearer');
			expect(token.expires_in).toBe(31536000);
			expect(typeof(token.access_token)).toBe('string');
			expect(token.access_token.length).toBeGreaterThan(100);

			await applicationRepository.deleteById(application.id);
		});
	});
});
