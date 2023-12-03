import {
	generateJwt,
	verifyJwt
} from "../../src/utils/JwtUtils";

describe("AuthUtils", () => {
	describe("generateJwt", () => {
		it("should generate a jwt for the user", () => {
			const token = generateJwt({
				userId: 1,
			}, "TestUser");

			expect(typeof (token)).toBe("string");
			expect(token.length).toBeGreaterThan(100);
		});
	});

	describe("verifyJwt", () => {
		it("should verify a user token", () => {
			let userPayload = verifyJwt(
				generateJwt({
					userId: 1,
				}, "Test User")
			);
			expect(userPayload["userId"]).toBe(1);

			let applicationPayload = verifyJwt(
				generateJwt({
					applicationId: 1,
				}, "Application User"),
			);
			expect(applicationPayload["applicationId"]).toBe(1);
		});
	});
});
