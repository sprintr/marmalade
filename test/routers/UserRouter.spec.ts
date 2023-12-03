import supertest from "supertest";

import app from "../../src/app";

import User, { Role, Status } from "../../src/models/User";

import UserRepository from "../../src/repositories/UserRepository";

describe("/v1/users", () => {
	let userRepository = new UserRepository();

	let user: User;

	let accessToken: string;

	beforeAll(async () => {
		const res = await supertest(app)
			.post("/v1/auth/sign-up")
			.set('Accept', 'application/json')
			.send({
				name: "Adam Gilchrist",
				emailAddress: "gilchrist@example.com",
				password: "test@password@123",
			});

		user = res.body.data.user;
		accessToken = res.body.data.accessToken;
	});

	afterAll(async () => {
		await userRepository.deleteById(user.id);
	});

	describe("POST /v1/users", () => {
		it("should create a user", async () => {
			const res = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Jason Gillespie",
					emailAddress: "gillespie@example.com",
					password: "test@password@123",
				});

			expect(res.status).toEqual(201);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Jason Gillespie");
			expect(res.body.data.emailAddress).toBe("gillespie@example.com");
			expect(res.body.data.role).toBe(Role.SuperAdmin);
			expect(res.body.data.status).toBe(Status.Active);

			await userRepository.deleteById(res.body.data.id);
		});
	});

	describe("GET /v1/users", () => {
		it("should retrieve users", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				}),
				resDos = await supertest(app)
					.post("/v1/users")
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						name: "Brett Lee",
						emailAddress: "lee@example.com",
						password: "hereGoesThePassword",
					}),
				resTres = await supertest(app)
					.post("/v1/users")
					.set('Accept', 'application/json')
					.set('Authorization', `Bearer ${accessToken}`)
					.send({
						name: "Stuart Clark",
						emailAddress: "clark@example.com",
						password: "hereGoesThePassword",
					});

			const res = await supertest(app)
				.get("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(201);
			expect(resDos.body.status).toBe('success');

			expect(resTres.status).toEqual(201);
			expect(resTres.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			console.log(res.body);

			expect(res.body.data.length).toBe(4);

			expect(res.body.data[0].name).toBe("Stuart Clark");
			expect(res.body.data[0].emailAddress).toBe("clark@example.com");
			expect(res.body.data[0].role).toBe(Role.SuperAdmin);
			expect(res.body.data[0].status).toBe(Status.Active);

			expect(res.body.data[1].name).toBe("Brett Lee");
			expect(res.body.data[1].emailAddress).toBe("lee@example.com");
			expect(res.body.data[1].role).toBe(Role.SuperAdmin);
			expect(res.body.data[1].status).toBe(Status.Active);

			expect(res.body.data[2].name).toBe("Glenn McGrath");
			expect(res.body.data[2].emailAddress).toBe("mcgrath@example.com");
			expect(res.body.data[2].role).toBe(Role.SuperAdmin);
			expect(res.body.data[2].status).toBe(Status.Active);

			expect(res.body.data[3].name).toBe("Adam Gilchrist");
			expect(res.body.data[3].emailAddress).toBe("gilchrist@example.com");
			expect(res.body.data[3].role).toBe(Role.SuperAdmin);
			expect(res.body.data[3].status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.id);
			await userRepository.deleteById(resDos.body.data.id);
			await userRepository.deleteById(resTres.body.data.id);
		});
	});

	describe("GET /v1/users/:userId", () => {
		it("should retrieve a user", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const res = await supertest(app)
				.get(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Glenn McGrath");
			expect(res.body.data.emailAddress).toBe("mcgrath@example.com");
			expect(res.body.data.role).toBe(Role.SuperAdmin);
			expect(res.body.data.status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/users/:userId", () => {
		it("should update a user", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const resDos = await supertest(app)
				.put(`/v1/users/${resUno.body.data.id}`)
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Brett Lee",
					emailAddress: "lee@example.com",
				});

			const res = await supertest(app)
				.get(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Brett Lee");
			expect(res.body.data.emailAddress).toBe("lee@example.com");
			expect(res.body.data.role).toBe(Role.SuperAdmin);
			expect(res.body.data.status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/users/:userId/password", () => {
		it("should update a user's password", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const resDos = await supertest(app)
				.put(`/v1/users/${resUno.body.data.id}/password`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					oldPassword: "hereGoesThePassword",
					newPassword: "test@password@124",
					confirmPassword: "test@password@124",
				});

			const res = await supertest(app)
				.post("/v1/auth/sign-in")
				.set('Accept', 'application/json')
				.send({
					emailAddress: "mcgrath@example.com",
					password: "test@password@124",
				});

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(201);
			expect(res.body.status).toBe('success');

			expect(res.body.data.user.name).toBe("Glenn McGrath");
			expect(res.body.data.user.emailAddress).toBe("mcgrath@example.com");
			expect(res.body.data.user.role).toBe(Role.SuperAdmin);
			expect(res.body.data.user.status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/users/:userId/role", () => {
		it("should update a user's role", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const resDos = await supertest(app)
				.put(`/v1/users/${resUno.body.data.id}/role`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					role: Role.StaffAdmin,
				});

			const res = await supertest(app)
				.get(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Glenn McGrath");
			expect(res.body.data.emailAddress).toBe("mcgrath@example.com");
			expect(res.body.data.role).toBe(Role.StaffAdmin);
			expect(res.body.data.status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("PUT /v1/users/:userId/status", () => {
		it("should update a user's status", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const resDos = await supertest(app)
				.put(`/v1/users/${resUno.body.data.id}/status`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					status: Status.Inactive,
				});

			const res = await supertest(app)
				.get(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(200);
			expect(resDos.body.status).toBe('success');

			expect(res.status).toEqual(200);
			expect(res.body.status).toBe('success');

			expect(res.body.data.name).toBe("Glenn McGrath");
			expect(res.body.data.emailAddress).toBe("mcgrath@example.com");
			expect(res.body.data.role).toBe(Role.SuperAdmin);
			expect(res.body.data.status).toBe(Status.Inactive);

			await userRepository.deleteById(resUno.body.data.id);
		});
	});

	describe("DELETE /v1/users/:userId", () => {
		it("should delete a user", async () => {
			const resUno = await supertest(app)
				.post("/v1/users")
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`)
				.send({
					name: "Glenn McGrath",
					emailAddress: "mcgrath@example.com",
					password: "hereGoesThePassword",
				});

			const resDos = await supertest(app)
				.delete(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${accessToken}`);

			const res = await supertest(app)
				.get(`/v1/users/${resUno.body.data.id}`)
				.set('Accept', 'application/json')
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
