import type { Category, Priority, Role, Status } from "@medical-display/common";
import db from "../../db/index.js";
import {
	applyFilters,
	type FilterMapping,
	type NestedKeys,
} from "../../utils/pagination.js";
import type { GetTasksQuery, Task } from "./tasks.type.js";

type TaskFilters = FilterMapping<NestedKeys<GetTasksQuery>>;

export const Tasks = {
	findAll: (query: GetTasksQuery = {}): { tasks: Task[]; total: number } => {
		const filterMappings: TaskFilters[] = [
			{
				key: "patient.firstName",
				value: "patient_first_name",
				type: "string",
			},
			{
				key: "patient.lastName",
				value: "patient_last_name",
				type: "string",
			},
			{
				key: "patient.roomNumber",
				value: "patient_room_number",
				type: "string",
			},
			{ key: "assignedTo.name", value: "assigned_to_name", type: "string" },
			{ key: "assignedTo.role", value: "assigned_to_role", type: "string" },
			{ key: "status", value: "status", type: "string" },
			{ key: "priority", value: "priority", type: "string" },
			{ key: "category", value: "category", type: "string" },
			{
				key: "dueDate.from",
				value: "due_date",
				type: "date",
				operator: ">=",
			},
			{ key: "dueDate.to", value: "due_date", type: "date", operator: "<=" },
		];
		const filters = applyFilters({
			getQuery: () => "SELECT * FROM task",
			filters: query,
			filterMappings,
			searchTerm: query.search ?? "",
			searchMappings: [
				"title",
				"COALESCE(description, '')",
				"patient_first_name",
				"patient_last_name",
				"assigned_to_name",
			],
			pagination: {
				limit: query.limit,
				offset: query.offset,
			},
		});

		const total = db
			.prepare(filters.countQuery)
			.get(...filters.countQueryParams) as { total: number };

		const rows = db.prepare(filters.query).all(...filters.params) as Array<
			Record<string, unknown>
		>;

		const tasks = rows.map((row) => ({
			id: row.id as string,
			title: row.title as string,
			description: (row.description ?? null) as string | null,
			createdAt: row.created_at as string,
			updatedAt: (row.updated_at ?? undefined) as string | undefined,
			patient: {
				id: row.patient_id as string,
				firstName: row.patient_first_name as string,
				lastName: row.patient_last_name as string,
				dateOfBirth: row.patient_date_of_birth as string,
				roomNumber: row.patient_room_number as string,
			},
			assignedTo: {
				id: row.assigned_to_id as string,
				name: row.assigned_to_name as string,
				role: row.assigned_to_role as Role,
			},
			priority: row.priority as Priority,
			status: row.status as Status,
			category: row.category as Category,
			dueDate: row.due_date as string,
			notes: (row.notes ?? null) as string | null,
		}));

		return { tasks, total: total.total };
	},
};
