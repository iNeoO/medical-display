import type { Category, Priority, Role, Status } from "@medical-display/common";
import { client } from "../hc";

export type GetTasksQueryParams = {
	search?: string;
	status?: Status;
	priority?: Priority;
	category?: Category;
	"assignedTo.name"?: string;
	"assignedTo.role"?: Role;
	"patient.firstName"?: string;
	"patient.lastName"?: string;
	"patient.roomNumber"?: string;
	"dueDate.from"?: string;
	"dueDate.to"?: string;
	offset?: string;
	limit?: string;
};

export const getTasks = async (query: GetTasksQueryParams) => {
	const res = await client.tasks.$get({ query });
	if (!res.ok) {
		throw new Error(`Error fetching tasks: ${res.statusText}`);
	}
	const json = await res.json();
	return json;
};
