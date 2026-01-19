import { Tasks } from "./tasks.repository.js";
import type { GetTasksQuery } from "./tasks.type.js";

export const getTasks = (query: GetTasksQuery) => {
	return Tasks.findAll(query);
};
