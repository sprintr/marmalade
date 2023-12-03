import supertest from "supertest";

import app from "../../src/app";

import User from "../../src/models/User";

import UserRepository from "../../src/repositories/UserRepository";
import ApplicationRepository from "../../src/repositories/ApplicationRepository";

import { verifyJwt } from "../../src/utils/JwtUtils";

describe("/oauth", () => {
	let userRepository = new UserRepository();

	let applicationRepository = new ApplicationRepository();

	let user: User;

	let accessToken: string;

	beforeAll(async () => {
		const res = await supertest(app)
			.post("/v1/auth/sign-up")
			.set('Accept', 'application/json')
			.send({
				name: "Ricky Ponting",
				emailAddress: "ponting@example.com",
				password: "test@password@123",
			});

		user = res.body.data.user;
		accessToken = res.body.data.accessToken;
	});

	afterAll(async () => {
		await userRepository.deleteById(user.id);
	});

	describe("POST /oauth/access_token", () => {
		it("should retrieve an access token", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Example Application",
					homepage: "https://example.com",
					description: "This is an example application",
				});

			const res = await supertest(app)
				.post("/oauth/access_token")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					grant_type: 'client_credentials',
					client_id: resUno.body.data.clientId,
					client_secret: resUno.body.data.clientSecret,
				});

			expect(res.status).toEqual(200);

			expect(res.body.token_type).toBe("Bearer");
			expect(res.body.expires_in).toBe(31536000);

			const payload = verifyJwt(res.body.access_token);
			expect(payload["clientId"]).toBe(resUno.body.data.clientId);
			expect(payload["sub"]).toBe("Example Application");

			await applicationRepository.deleteById(resUno.body.data.id);
		});
	});
});
