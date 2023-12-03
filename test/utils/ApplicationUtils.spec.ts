import {
	getRandomUuid,
	getRandomSecret,
} from "../../src/utils/ApplicationUtils";

describe("ApplicationUtils", () => {
	describe("getRandomUuid", () => {
		it("should generate a random uuid", async () => {
			const uuid = getRandomUuid();
			expect(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(uuid)).toBe(true);
		});
	});

	describe("getRandomSecret", () => {
		it("should generate a random secret", async () => {
			const secret = getRandomSecret();
			expect(typeof (secret)).toBe("string");
			expect(secret.length).toBe(64);
		});
	});
});
