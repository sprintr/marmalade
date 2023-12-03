
/**
 * Returns the offset and limit for pagination
 */
export const getPagination = (
	pageNumber: number,
	itemsPerPage: number,
): {
	offset: number;
	limit: number;
} => {
	if (!pageNumber || pageNumber <= 0) {
		pageNumber = 1;
	}

	if (!itemsPerPage || itemsPerPage <= 0) {
		itemsPerPage = 30;
	}

	return {
		offset: (itemsPerPage * pageNumber) - itemsPerPage,
		limit: itemsPerPage,
	};
}
