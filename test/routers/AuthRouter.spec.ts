import supertest from "supertest";

import app from "../../src/app";

import { Role, Status } from "../../src/models/User";

import UserRepository from "../../src/repositories/UserRepository";

import {
	compare,
} from "../../src/utils/AuthUtils";
import {
	verifyJwt,
} from "../../src/utils/JwtUtils";

describe("/v1/auth", () => {
	let userRepository = new UserRepository();

	describe("POST /v1/auth/sign-up", () => {
		it("should sign up a user", async () => {
			const res = await supertest(app)
				.post("/v1/auth/sign-up")
				.set('Accept', 'application/json')
				.send({
					name: "Michael Hussey",
					emailAddress: "hussey@example.com",
					password: "test@password@123",
				});

			expect(res.status).toEqual(201);
			expect(res.body.status).toBe('success');

			const payload = verifyJwt(res.body.data.accessToken);
			expect(payload["userId"]).toBe(res.body.data.user.id);
			expect(payload["sub"]).toBe(res.body.data.user.name);

			const userFound = await userRepository.findById(res.body.data.user.id);
			expect(userFound?.name).toBe("Michael Hussey");
			expect(userFound?.emailAddress).toBe("hussey@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			expect(compare("test@password@123", userFound?.password as string)).toBe(true);

			await userRepository.deleteById(res.body.data.user.id);
		});

		it("should NOT sign up a user with empty params", async () => {
			const res = await supertest(app)
				.post("/v1/auth/sign-up")
				.set('Accept', 'application/json')
				.send();

			expect(res.status).toEqual(400);
			expect(res.body.status).toBe('fail');

			expect(res.body.errors.name).toBe('The name field is mandatory.');
			expect(res.body.errors.emailAddress).toBe('The email address field is mandatory.');
			expect(res.body.errors.password).toBe('The password field is mandatory.');
		});

		it("should NOT sign up a user with invalid email addresses", async () => {
			const res = await supertest(app)
				.post("/v1/auth/sign-up")
				.set('Accept', 'application/json')
				.send({
					name: "Michael Hussey",
					emailAddress: "hussey@example@example.com",
					password: "test@password@123",
				});

			expect(res.status).toEqual(400);
			expect(res.body.status).toBe('fail');

			expect(res.body.errors.emailAddress).toBe('Please enter a valid email address.');
		});

		it("should NOT sign up a user with duplicate email addresses", async () => {
			const resUno = await supertest(app)
				.post("/v1/auth/sign-up")
				.set('Accept', 'application/json')
				.send({
					name: "Michael Hussey",
					emailAddress: "hussey@example.com",
					password: "test@password@123",
				}),
				resDos = await supertest(app)
					.post("/v1/auth/sign-up")
					.set('Accept', 'application/json')
					.send({
						name: "Michael Hussey",
						emailAddress: "hussey@example.com",
						password: "test@password@123",
					});

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resDos.status).toEqual(400);
			expect(resDos.body.status).toBe('fail');

			expect(resDos.body.errors.emailAddress).toBe('This email address is not available. Please enter a different email address.');

			await userRepository.deleteById(resUno.body.data.user.id);
		});
	});

	describe("POST /v1/auth/sign-in", () => {
		it("should sign in a user", async () => {
			const resUno = await supertest(app)
				.post("/v1/auth/sign-up")
				.set('Accept', 'application/json')
				.send({
					name: "Michael Hussey",
					emailAddress: "hussey@example.com",
					password: "test@password@123",
				});

			const resDos = await supertest(app)
				.post("/v1/auth/sign-in")
				.set('Accept', 'application/json')
				.send({
					emailAddress: "hussey@example.com",
					password: "test@password@123",
				});

			expect(resUno.status).toEqual(201);
			expect(resUno.body.status).toBe('success');

			expect(resUno.body.data.user.name).toBe("Michael Hussey");
			expect(resUno.body.data.user.emailAddress).toBe("hussey@example.com");
			expect(resUno.body.data.user.role).toBe(Role.SuperAdmin);
			expect(resUno.body.data.user.status).toBe(Status.Active);

			expect(resDos.status).toEqual(201);
			expect(resDos.body.status).toBe('success');

			const payload = verifyJwt(resDos.body.data.accessToken);
			expect(payload["userId"]).toBe(resDos.body.data.user.id);
			expect(payload["sub"]).toBe(resDos.body.data.user.name);

			expect(resDos.body.data.user.name).toBe("Michael Hussey");
			expect(resDos.body.data.user.emailAddress).toBe("hussey@example.com");
			expect(resDos.body.data.user.role).toBe(Role.SuperAdmin);
			expect(resDos.body.data.user.status).toBe(Status.Active);

			await userRepository.deleteById(resUno.body.data.user.id);
		});
	});
});
