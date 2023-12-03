import supertest from "supertest";

import app from "../../src/app";

import User from "../../src/models/User";

import { Status } from "../../src/models/Application";

import UserRepository from "../../src/repositories/UserRepository";
import ApplicationRepository from "../../src/repositories/ApplicationRepository";

describe("/v1/applications", () => {
	let userRepository = new UserRepository();

	let applicationRepository = new ApplicationRepository();

	let user: User;

	let accessToken: string;

	beforeAll(async () => {
		const res = await supertest(app)
			.post("/v1/auth/sign-up")
			.set('Accept', 'application/json')
			.send({
				name: "Michael Clarke",
				emailAddress: "clarke@example.com",
				password: "test@password@123",
			});

		user = res.body.data.user;
		accessToken = res.body.data.accessToken;
	});

	afterAll(async () => {
		await userRepository.deleteById(user.id);
	});

	describe("POST /v1/applications", () => {
		it("should create an application", async () => {
			const res = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Example Application",
					homepage: "https://example.com",
					description: "This is an example application",
				});

			expect(res.status).toEqual(201);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Example Application");
			expect(res.body.data.homepage).toBe("https://example.com");
			expect(res.body.data.description).toBe("This is an example application");
			expect(res.body.data.clientId?.length).toBe(36);
			expect(res.body.data.clientSecret?.length).toBe(64);
			expect(res.body.data.status).toBe(Status.Active);

			await applicationRepository.deleteById(res.body.data.id);
		});
	});

	describe("GET /v1/applications", () => {
		it("should retrieve all applications", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Orders Application",
					homepage: "https://orders.example.com",
					description: "This is the orders application",
				}),
				resDos = await supertest(app)
					.post("/v1/applications")
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						name: "Payments Application",
						homepage: "https://payments.example.com",
						description: "This is the payments application",
					}),
				resTres = await supertest(app)
					.post("/v1/applications")
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						name: "Subscriptions Application",
						homepage: "https://subscriptions.example.com",
						description: "This is the subscriptions application",
					});

			const res = await supertest(app)
				.get("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(201);
			expect(resDos.body.status).toBe('success');

			expect(resTres.status).toEqual(201);
			expect(resTres.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data[0]?.name).toBe("Subscriptions Application");
			expect(res.body.data[0]?.homepage).toBe("https://subscriptions.example.com");
			expect(res.body.data[0]?.description).toBe("This is the subscriptions application");
			expect(res.body.data[0]?.status).toBe(Status.Active);

			expect(res.body.data[1]?.name).toBe("Payments Application");
			expect(res.body.data[1]?.homepage).toBe("https://payments.example.com");
			expect(res.body.data[1]?.description).toBe("This is the payments application");
			expect(res.body.data[1]?.status).toBe(Status.Active);

			expect(res.body.data[2]?.name).toBe("Orders Application");
			expect(res.body.data[2]?.homepage).toBe("https://orders.example.com");
			expect(res.body.data[2]?.description).toBe("This is the orders application");
			expect(res.body.data[2]?.status).toBe(Status.Active);

			await applicationRepository.deleteById(resUno.body.data.id);
			await applicationRepository.deleteById(resDos.body.data.id);
			await applicationRepository.deleteById(resTres.body.data.id);
		});
	});

	describe("GET /v1/applications/:applicationId", () => {
		it("should retrieve an application", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Orders Application",
					homepage: "https://orders.example.com",
					description: "This is the orders application",
				});

			const res = await supertest(app)
				.get(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Orders Application");
			expect(res.body.data.homepage).toBe("https://orders.example.com");
			expect(res.body.data.description).toBe("This is the orders application");
			expect(res.body.data.status).toBe(Status.Active);

			await applicationRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/applications/:applicationId", () => {
		it("should update an application", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Orders Application",
					homepage: "https://orders.example.com",
					description: "This is the orders application",
				});

			const resDos = await supertest(app)
				.put(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Tracking Application",
					homepage: "https://tracking.example.com",
					description: "This is the tracking application",
				});

			const resTres = await supertest(app)
				.get(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(resTres.status).toEqual(200);
			expect(resTres.body.status).toBe('success');

			expect(resTres.body.data.name).toBe("Tracking Application");
			expect(resTres.body.data.homepage).toBe("https://tracking.example.com");
			expect(resTres.body.data.description).toBe("This is the tracking application");
			expect(resTres.body.data.status).toBe(Status.Active);

			await applicationRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/applications/:applicationId/credentials", () => {
		it("should update the application's credentials", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Orders Application",
					homepage: "https://orders.example.com",
					description: "This is the orders application",
				});

			const resDos = await supertest(app)
				.put(`/v1/applications/${resUno.body.data.id}/credentials`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Tracking Application",
					homepage: "https://tracking.example.com",
					description: "This is the tracking application",
				});

			const res = await supertest(app)
				.get(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Orders Application");
			expect(res.body.data.homepage).toBe("https://orders.example.com");
			expect(res.body.data.description).toBe("This is the orders application");
			expect(res.body.data.status).toBe(Status.Active);

			expect(res.body.data.clientId !== resUno.body.data.clientId).toBe(true);
			expect(res.body.data.clientSecret !== resUno.body.data.clientSecret).toBe(true);

			await applicationRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("DELETE /v1/applications/:applicationId", () => {
		it("should delete an application", async () => {
			const resUno = await supertest(app)
				.post("/v1/applications")
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Orders Application",
					homepage: "https://orders.example.com",
					description: "This is the orders application",
				});

			const resDos = await supertest(app)
				.delete(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`);

			const res = await supertest(app)
				.get(`/v1/applications/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(404);
			expect(res.body.status).toBe('fail');
		});
	});
});
