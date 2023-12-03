import { Role, Status } from "../../src/models/User";

import UserRepository from "../../src/repositories/UserRepository";

import AuthService from "../../src/services/AuthService";

import { compare } from "../../src/utils/AuthUtils";

describe("AuthService", () => {
	let userRepository: UserRepository;

	let authService: AuthService;

	beforeAll(() => {
		userRepository = new UserRepository();
		authService = new AuthService(userRepository);
	});

	describe("signUp", () => {
		it("should sign in a user", async () => {
			const auth = await authService.signUp({
				name: "Imran Khan",
				emailAddress: "imran@example.com",
				password: "test@password@123",
			});

			expect(auth?.user?.name).toBe("Imran Khan");
			expect(auth?.user?.emailAddress).toBe("imran@example.com");
			expect(auth?.user?.role).toBe(Role.SuperAdmin);
			expect(auth?.user?.status).toBe(Status.Active);

			const userFound = await userRepository.findById(auth.user.id);
			expect(userFound?.name).toBe("Imran Khan");
			expect(userFound?.emailAddress).toBe("imran@example.com");
			expect(userFound?.role).toBe(Role.SuperAdmin);
			expect(userFound?.status).toBe(Status.Active);

			expect(compare("test@password@123", userFound?.password as string)).toBe(true);

			await userRepository.deleteById(auth.user.id);
		});
	});

	describe("signIn", () => {
		it("should sign in a user", async () => {
			await authService.signUp({
				name: "Imran Khan",
				emailAddress: "imran@example.com",
				password: "test@password@123",
			});

			const auth = await authService.signIn({
				emailAddress: "imran@example.com",
				password: "test@password@123",
			});

			expect(auth?.user?.name).toBe("Imran Khan");
			expect(auth?.user?.emailAddress).toBe("imran@example.com");
			expect(auth?.user?.role).toBe(Role.SuperAdmin);
			expect(auth?.user?.status).toBe(Status.Active);

			await userRepository.deleteById(auth.user.id);
		});
	});
});
