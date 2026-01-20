type Params = number | string | null | Date | boolean;
type MappingType = "number" | "string" | "date" | "boolean";
type MappingOperator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "like";
type Mapping = {
  key: string;
  value: string;
  type: MappingType;
  operator?: MappingOperator;
};

export type FilterMapping<Key extends string = string> = {
  key: Key;
  value: string;
  type: MappingType;
  operator?: MappingOperator;
};

type Pagination = {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
};

type PlainObject = Record<string, unknown>;

type NonNullableValue<T> = Exclude<T, null | undefined>;

export type NestedKeys<T> = T extends PlainObject
  ? {
      [K in keyof T & string]: NonNullableValue<T[K]> extends Params
        ? K
        : NonNullableValue<T[K]> extends PlainObject
          ? K | `${K}.${NestedKeys<NonNullableValue<T[K]>>}`
          : NonNullableValue<T[K]> extends Array<unknown>
            ? K
            : K;
    }[keyof T & string]
  : never;

const getSort = (
  mappings: Mapping[],
  sortBy: string | undefined,
  sortOrder: "asc" | "desc" = "asc",
) => {
  if (!sortBy) return "";
  const title = mappings.find(({ key }) => key === sortBy);
  if (!title) return "";
  if (title.type === "string") {
    return `ORDER BY LOWER(${title.value}) ${sortOrder === "desc" ? "DESC" : "ASC"}`;
  }
  return `ORDER BY ${title.value} ${sortOrder === "desc" ? "DESC" : "ASC"}`;
};

const coerceValue = (value: unknown, type: Mapping["type"]): Params | null => {
  if (value === null || value === undefined) return null;

  if (type === "number") {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isNaN(num) ? null : num;
  }

  if (type === "boolean") {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
    return null;
  }

  if (type === "date") {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string" && value.length > 0) return value;
    return null;
  }

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return null;
};

const getValueByPath = (filters: PlainObject, path: string) => {
  if (Object.hasOwn(filters, path)) {
    return filters[path];
  }

  return path.split(".").reduce<unknown>((value, key) => {
    if (value && typeof value === "object") {
      return (value as PlainObject)[key];
    }
    return undefined;
  }, filters);
};

const getFilters = (filters: PlainObject, mappings: FilterMapping[]) => {
  if (mappings.length === 0) {
    return {
      query: "",
      params: [],
    };
  }

  const filterQuery: string[] = [];
  const filterParams: Params[] = [];

  for (const mapping of mappings) {
    const raw = getValueByPath(filters, mapping.key);
    if (raw === undefined || raw === null || raw === "") continue;

    const value = coerceValue(raw, mapping.type);
    if (value === null) continue;

    if (mapping.operator === "like") {
      if (typeof value !== "string") continue;
      filterQuery.push(`LOWER(${mapping.value}) LIKE ?`);
      filterParams.push(`%${value.toLowerCase()}%`);
      continue;
    }

    const operator = mapping.operator ?? "=";
    filterQuery.push(`${mapping.value} ${operator} ?`);
    filterParams.push(value);
  }

  return {
    query: filterQuery.join(" AND "),
    params: filterParams,
  };
};

const getSearch = (params: string[], search: string) => {
  if (!search || params.length === 0) {
    return {
      query: "",
      params: [],
    };
  }

  const searchQuery = `(
		${params.map((value) => `LOWER(${value}) LIKE ?`).join(" OR ")}
	)`;
  const searchTerm = `%${search.toLowerCase()}%`;
  return {
    query: searchQuery,
    params: Array(params.length).fill(searchTerm),
  };
};

const applyPagination = ({
  sqlQuery,
  params,
  limit,
  offset,
  sortQuery = "",
}: {
  sqlQuery: string;
  params: Params[];
  limit?: number;
  offset?: number;
  sortQuery?: string;
}) => {
  const paginationParams = [...params];
  let paginationQuery = "";
  if (typeof limit === "number") {
    paginationQuery = "LIMIT ?";
    paginationParams.push(limit);
    if (typeof offset === "number") {
      paginationQuery += " OFFSET ?";
      paginationParams.push(offset);
    }
  } else if (typeof offset === "number") {
    paginationQuery = "LIMIT -1 OFFSET ?";
    paginationParams.push(offset);
  }

  const paginatedQuery = `
    ${sqlQuery}
    ${sortQuery}
    ${paginationQuery}
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM (${sqlQuery}) AS subquery;
  `;

  return {
    countQuery,
    countQueryParams: params,
    params: paginationParams,
    query: paginatedQuery,
  };
};

export const applyFilters = ({
  getQuery,
  baseParams = [],
  mappings = [],
  filterMappings = [],
  filters = {},
  pagination: { limit = 20, offset = 0, sortBy, sortOrder = "asc" } = {},
  searchTerm = "",
  searchMappings = [],
}: {
  getQuery: () => string;
  baseParams?: Params[];
  mappings?: Mapping[];
  filterMappings?: FilterMapping[];
  filters?: Record<string, unknown>;
  pagination?: Pagination;
  searchTerm?: string;
  searchMappings?: string[];
}) => {
  const baseQuery = getQuery();
  const { query: filterQuery, params: filterParams } = getFilters(
    filters,
    filterMappings,
  );
  const { query: searchQuery, params: searchParams } = getSearch(
    searchMappings,
    searchTerm,
  );
  const whereParts = [filterQuery, searchQuery].filter(Boolean);
  const sqlQuery =
    whereParts.length > 0
      ? `${baseQuery} WHERE ${whereParts.join(" AND ")}`
      : baseQuery;
  const sortQuery = getSort(mappings, sortBy, sortOrder);
  return applyPagination({
    sqlQuery,
    params: [...baseParams, ...filterParams, ...searchParams],
    limit,
    offset,
    sortQuery,
  });
};
