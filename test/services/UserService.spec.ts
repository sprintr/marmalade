import { Role, Status } from "../../src/models/User";

import UserRepository from "../../src/repositories/UserRepository";

import UserService from "../../src/services/UserService";

import { compare } from "../../src/utils/AuthUtils";

describe("UserService", () => {
	let userRepository: UserRepository;

	let userService: UserService;

	beforeAll(() => {
		userRepository = new UserRepository();
		userService = new UserService(userRepository);
	});

	describe("createUser", () => {
		it("should create a user", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			expect(user?.name).toBe("Zulfiqar Ali");
			expect(user?.emailAddress).toBe("zulfiqar@example.com");
			expect(user?.role).toBe(Role.SuperAdmin);
			expect(user?.status).toBe(Status.Active);

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			expect(compare("test@password@123", userFound?.password as string)).toBe(true);

			await userRepository.deleteById(user.id);
		});

		it("should create a user with role and status", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
				role: Role.ManagerAdmin,
				status: Status.Inactive,
			});

			expect(user?.name).toBe("Zulfiqar Ali");
			expect(user?.emailAddress).toBe("zulfiqar@example.com");
			expect(user?.role).toBe(Role.ManagerAdmin);
			expect(user?.status).toBe(Status.Inactive);

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.ManagerAdmin);
			expect(userFound?.status).toBe(Status.Inactive);

			expect(compare("test@password@123", userFound?.password as string)).toBe(true);

			await userRepository.deleteById(user.id);
		});
	});

	describe("getUser", () => {
		it("should retrieve a user by their id", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			const userFound = await userService.getUser(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("getUserByEmailAddress", () => {
		it("should retrieve a user by their email address", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			const userFound = await userService.getUserByEmailAddress("zulfiqar@example.com");
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("getAllUsers", () => {
		it("should retrieve users in descending order", async () => {
			const badat = await userService.createUser({
				name: "Yunus Badat",
				emailAddress: "badat@example.com",
				password: "hereGoesThePassword",
			}), nagenda = await userService.createUser({
				name: "John Nagenda",
				emailAddress: "nagenda@example.com",
				password: "hereGoesThePassword",
			}), nana = await userService.createUser({
				name: "Parbhu Nana",
				emailAddress: "nana@example.com",
				password: "hereGoesThePassword",
			}), quaraishy = await userService.createUser({
				name: "Mehmood Quaraishy",
				emailAddress: "quaraishy@example.com",
				password: "hereGoesThePassword",
			});

			const users = await userService.getAllUsers({}, "desc", 1, 30);
			expect(users.length).toBe(4);

			expect(users[0].name).toBe("Mehmood Quaraishy");
			expect(users[0].emailAddress).toBe("quaraishy@example.com");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("Parbhu Nana");
			expect(users[1].emailAddress).toBe("nana@example.com");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			expect(users[2].name).toBe("John Nagenda");
			expect(users[2].emailAddress).toBe("nagenda@example.com");
			expect(users[2].role).toBe(Role.SuperAdmin);
			expect(users[2].status).toBe(Status.Active);

			expect(users[3].name).toBe("Yunus Badat");
			expect(users[3].emailAddress).toBe("badat@example.com");
			expect(users[3].role).toBe(Role.SuperAdmin);
			expect(users[3].status).toBe(Status.Active);

			await userRepository.deleteById(badat.id);
			await userRepository.deleteById(nagenda.id);
			await userRepository.deleteById(nana.id);
			await userRepository.deleteById(quaraishy.id);
		});

		it("should retrieve users in ascending order", async () => {
			const badat = await userService.createUser({
				name: "Yunus Badat",
				emailAddress: "badat@example.com",
				password: "hereGoesThePassword",
			}), nagenda = await userService.createUser({
				name: "John Nagenda",
				emailAddress: "nagenda@example.com",
				password: "hereGoesThePassword",
			}), nana = await userService.createUser({
				name: "Parbhu Nana",
				emailAddress: "nana@example.com",
				password: "hereGoesThePassword",
			}), quaraishy = await userService.createUser({
				name: "Mehmood Quaraishy",
				emailAddress: "quaraishy@example.com",
				password: "hereGoesThePassword",
			});

			const users = await userService.getAllUsers({}, "asc", 1, 30);
			expect(users.length).toBe(4);

			expect(users[0].name).toBe("Yunus Badat");
			expect(users[0].emailAddress).toBe("badat@example.com");
			expect(users[0].role).toBe(Role.SuperAdmin);
			expect(users[0].status).toBe(Status.Active);

			expect(users[1].name).toBe("John Nagenda");
			expect(users[1].emailAddress).toBe("nagenda@example.com");
			expect(users[1].role).toBe(Role.SuperAdmin);
			expect(users[1].status).toBe(Status.Active);

			expect(users[2].name).toBe("Parbhu Nana");
			expect(users[2].emailAddress).toBe("nana@example.com");
			expect(users[2].role).toBe(Role.SuperAdmin);
			expect(users[2].status).toBe(Status.Active);

			expect(users[3].name).toBe("Mehmood Quaraishy");
			expect(users[3].emailAddress).toBe("quaraishy@example.com");
			expect(users[3].role).toBe(Role.SuperAdmin);
			expect(users[3].status).toBe(Status.Active);

			await userRepository.deleteById(badat.id);
			await userRepository.deleteById(nagenda.id);
			await userRepository.deleteById(nana.id);
			await userRepository.deleteById(quaraishy.id);
		});
	});

	describe("updateUser", () => {
		it("should update a user", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			await userService.updateUser(user.id, {
				name: "Jane Doe",
				emailAddress: "jane@example.com",
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Jane Doe");
			expect(userFound?.emailAddress).toBe("jane@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updateUserPassword", () => {
		it("should update a user's password", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			await userService.updateUserPassword(user.id, {
				newPassword: "test@password@124",
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			expect(compare("test@password@124", userFound?.password as string)).toBe(true);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updateUserRole", () => {
		it("should update a user's role", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			await userService.updateUserRole(user.id, {
				role: Role.ManagerAdmin,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.ManagerAdmin);
			expect(userFound?.status).toBe(Status.Active);

			await userRepository.deleteById(user.id);
		});
	});

	describe("updateUserStatus", () => {
		it("should update a user's status", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			await userService.updateUserStatus(user.id, {
				status: Status.Inactive,
			});

			const userFound = await userRepository.findById(user.id);
			expect(userFound?.name).toBe("Zulfiqar Ali");
			expect(userFound?.emailAddress).toBe("zulfiqar@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Inactive);

			await userRepository.deleteById(user.id);
		});
	});

	describe("deleteUser", () => {
		it("should delete a user", async () => {
			const user = await userService.createUser({
				name: "Zulfiqar Ali",
				emailAddress: "zulfiqar@example.com",
				password: "test@password@123",
			});

			await userService.deleteUser(user.id);

			const userFound = await userRepository.findById(user.id);
			expect(userFound).toBe(null);
		});
	});
});
