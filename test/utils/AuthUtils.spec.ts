import {
	hash,
	compare,
} from "../../src/utils/AuthUtils";

describe("AuthUtils", () => {
	describe("hash", () => {
		it("should generate a hash for a password", () => {
			const password = hash("P@assword#1492");
			expect(typeof (password)).toBe("string");
			expect(password.length).toBe(60);
		});
	});

	describe("compare", () => {
		it("should compare a hash against its password", () => {
			expect(compare("p@ssword@*1923", "$2a$10$HHuzc01p3wSSq0MgR6G0vOL83ryEDP6Lg/y8XzJYga5.T9U1Q2IAq")).toBe(true);
			expect(compare("p@ssword@*2009", "$2a$10$TyOFpiRlsoxEFq8eZAMkhuAz8KUOZFGO.w5LRjFz166xkRyLr9zfm")).toBe(true);
			expect(compare("p@ssword@*1946", "$2a$10$YlG0R6HzBhq0mgQaWqLmeu3NX.gShHPFTAkMP9NoYjcGdm1/6/4mK")).toBe(true);
		});
	});
});
