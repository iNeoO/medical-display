type Params = number | string | null | Date | boolean;
type Mapping = {
	key: string;
	value: string;
	type: "number" | "string" | "date" | "boolean";
};

type Pagination = {
	sortBy: string;
	sortOrder?: "asc" | "desc";
	limit?: number;
	offset?: number;
};

const getSort = (
	mappings: Mapping[],
	sortBy: string,
	sortOrder: "asc" | "desc",
) => {
	const finalSortBy = sortBy;
	const title = mappings.find(({ key }) => key === finalSortBy);
	if (!title) return "";
	if (title.type === "string") {
		return `ORDER BY LOWER(${title.value}) ${sortOrder === "desc" ? "DESC" : "ASC"}`;
	}
	return `ORDER BY ${title.value} ${sortOrder === "desc" ? "DESC" : "ASC"}`;
};

const applyPagination = (
	sqlQuery: string,
	params: Params[],
	limit: number,
	offset: number,
	sortQuery = "",
) => {
	const paginatedQuery = `
    ${sqlQuery}
    ${sortQuery}
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

	const countQuery = `
    SELECT COUNT(*) AS total FROM (${sqlQuery}) AS subquery;
  `;

	return {
		countQuery,
		countQueryParams: params,
		params: [...params, limit, offset],
		query: paginatedQuery,
	};
};

export const applyFilters = (
	getQuery: () => string,
	baseParams: Params[],
	mappings: Mapping[],
	{ limit = 20, offset = 0, sortBy, sortOrder = "asc" }: Pagination,
) => {
	const baseQuery = getQuery();
	const sortQuery = getSort(mappings, sortBy, sortOrder);
	return applyPagination(baseQuery, baseParams, limit, offset, sortQuery);
};
