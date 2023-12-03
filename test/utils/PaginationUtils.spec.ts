import {
	getPagination,
} from "../../src/utils/PaginationUtils";

describe("PaginationUtils", () => {
	describe("getPagination", () => {
		it("should give offset and limit for default numbers", () => {
			const { offset, limit, } = getPagination(1, 42);
			expect(offset).toBe(0);
			expect(limit).toBe(42);
		});

		it("should give offset and limit for second numbers", () => {
			const { offset, limit, } = getPagination(2, 42);
			expect(offset).toBe(42);
			expect(limit).toBe(42);
		});

		it("should give offset and limit for 100th numbers", () => {
			const { offset, limit, } = getPagination(100, 42);
			expect(offset).toBe(4158);
			expect(limit).toBe(42);
		});
	});
});
