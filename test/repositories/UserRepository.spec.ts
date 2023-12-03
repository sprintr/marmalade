import UserRepository from "../../src/repositories/UserRepository";

import {
	Role,
	Status,
} from "../../src/models/User";

describe("UserRepository", () => {
	let userRepository: UserRepository;

	beforeAll(() => {
		userRepository = new UserRepository();
	});

	describe("create", () => {
		it("should create a user", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Michael Vaughan");
			expect(userFound?.emailAddress).toBe("vaughan@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("findById", () => {
		it("should find a user by their id", async () => {
			const user = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Andrew Flintoff");
			expect(userFound?.emailAddress).toBe("flintoff@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("findByEmailAddress", () => {
		it("should find a user by their email address", async () => {
			const user = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const userFound = await userRepository.findByEmailAddress("flintoff@example.com");
			expect(userFound?.name).toBe("Andrew Flintoff");
			expect(userFound?.emailAddress).toBe("flintoff@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("findAll", () => {
		it("should find all users in descending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAll('desc', 0, 4);
			expect(users.length).toBe(4);

			expect(users[0].name).toBe("Ian Bell");
			expect(users[0].emailAddress).toBe("bell@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("James Anderson");
			expect(users[1].emailAddress).toBe("anderson@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			expect(users[2].name).toBe("Andrew Flintoff");
			expect(users[2].emailAddress).toBe("flintoff@example.com");
			expect(users[2].password).toBe("test@password@123");
			expect(users[2].role).toBe(Role.SuperAdmin);
			expect(users[2].status).toBe(Status.Active);

			expect(users[3].name).toBe("Michael Vaughan");
			expect(users[3].emailAddress).toBe("vaughan@example.com");
			expect(users[3].password).toBe("test@password@123");
			expect(users[3].role).toBe(Role.SuperAdmin);
			expect(users[3].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});

		it("should find all users in descending order with pagination", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAll('desc', 0, 2);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Ian Bell");
			expect(users[0].emailAddress).toBe("bell@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("James Anderson");
			expect(users[1].emailAddress).toBe("anderson@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});

		it("should find all users in ascending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAll('asc', 0, 4);
			expect(users.length).toBe(4);

			expect(users[0].name).toBe("Michael Vaughan");
			expect(users[0].emailAddress).toBe("vaughan@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("Andrew Flintoff");
			expect(users[1].emailAddress).toBe("flintoff@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			expect(users[2].name).toBe("James Anderson");
			expect(users[2].emailAddress).toBe("anderson@example.com");
			expect(users[2].password).toBe("test@password@123");
			expect(users[2].role).toBe(Role.SuperAdmin);
			expect(users[2].status).toBe(Status.Active);

			expect(users[3].name).toBe("Ian Bell");
			expect(users[3].emailAddress).toBe("bell@example.com");
			expect(users[3].password).toBe("test@password@123");
			expect(users[3].role).toBe(Role.SuperAdmin);
			expect(users[3].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});

		it("should find all users in ascending order with pagination", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAll('asc', 0, 2);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Michael Vaughan");
			expect(users[0].emailAddress).toBe("vaughan@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("Andrew Flintoff");
			expect(users[1].emailAddress).toBe("flintoff@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});
	});

	describe("findAllByRole", () => {
		it("should find all users by their role in descending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.StaffAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.StaffAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAllByRole('SuperAdmin', 'desc', 0, 4);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Ian Bell");
			expect(users[0].emailAddress).toBe("bell@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("James Anderson");
			expect(users[1].emailAddress).toBe("anderson@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});

		it("should find all users by their role in ascending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.StaffAdmin,
				status: Status.Active,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.StaffAdmin,
				status: Status.Active,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAllByRole('StaffAdmin', 'asc', 0, 4);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Michael Vaughan");
			expect(users[0].emailAddress).toBe("vaughan@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.StaffAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("Andrew Flintoff");
			expect(users[1].emailAddress).toBe("flintoff@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.StaffAdmin);
			expect(users[1].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});
	});

	describe("findAllByStatus", () => {
		it("should find all users by their status in descending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Inactive,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Inactive,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAllByStatus('Active', 'desc', 0, 4);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Ian Bell");
			expect(users[0].emailAddress).toBe("bell@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("James Anderson");
			expect(users[1].emailAddress).toBe("anderson@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});

		it("should find all users by their status in ascending order", async () => {
			const vaughan = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Inactive,
			}), flintoff = await userRepository.create({
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Inactive,
			}), anderson = await userRepository.create({
				name: "James Anderson",
				emailAddress: "anderson@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			}), bell = await userRepository.create({
				name: "Ian Bell",
				emailAddress: "bell@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			const users = await userRepository.findAllByStatus('Inactive', 'asc', 0, 4);
			expect(users.length).toBe(2);

			expect(users[0].name).toBe("Michael Vaughan");
			expect(users[0].emailAddress).toBe("vaughan@example.com");
			expect(users[0].password).toBe("test@password@123");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Inactive);

			expect(users[1].name).toBe("Andrew Flintoff");
			expect(users[1].emailAddress).toBe("flintoff@example.com");
			expect(users[1].password).toBe("test@password@123");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Inactive);

			await userRepository.deleteById(vaughan.id);
			await userRepository.deleteById(flintoff.id);
			await userRepository.deleteById(anderson.id);
			await userRepository.deleteById(bell.id);
		});
	});

	describe("updateById", () => {
		it("should update a user", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			await userRepository.updateById(user.id, {
				name: "Andrew Flintoff",
				emailAddress: "flintoff@example.com",
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Andrew Flintoff");
			expect(userFound?.emailAddress).toBe("flintoff@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updatePasswordById", () => {
		it("should update a user's password", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			await userRepository.updatePasswordById(user.id, {
				password: "hereGoesTheNewPassword",
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Michael Vaughan");
			expect(userFound?.emailAddress).toBe("vaughan@example.com");
			expect(userFound?.password).toBe("hereGoesTheNewPassword");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updateRoleById", () => {
		it("should update a user's role", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			await userRepository.updateRoleById(user.id, {
				role: Role.StaffAdmin,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Michael Vaughan");
			expect(userFound?.emailAddress).toBe("vaughan@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.StaffAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updateStatusById", () => {
		it("should update a user's status", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			await userRepository.updateStatusById(user.id, {
				status: Status.Inactive,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Michael Vaughan");
			expect(userFound?.emailAddress).toBe("vaughan@example.com");
			expect(userFound?.password).toBe("test@password@123");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Inactive);

			await userRepository.deleteById(user.id);
		});
	});

	describe("deleteById", () => {
		it("should delete a user", async () => {
			const user = await userRepository.create({
				name: "Michael Vaughan",
				emailAddress: "vaughan@example.com",
				password: "test@password@123",
				role: Role.SuperAdmin,
				status: Status.Active,
			});

			await userRepository.deleteById(user.id);

			const userFound = await userRepository.findById(user.id);
			expect(userFound).toBe(null);
		});
	});
});
