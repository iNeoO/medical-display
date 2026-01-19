import type { Category, Priority, Role, Status } from "@medica/common";
import db from "../../db/index.js";
import type { GetTasksQuery, Task } from "./tasks.type.js";

export const Tasks = {
	findAll: (query: GetTasksQuery): { tasks: Task[]; total: number } => {
		const conditions: string[] = [];
		const filterParams: Array<string | number> = [];

		if (query.search) {
			conditions.push(
				`(
					LOWER(title) LIKE ?
					OR LOWER(COALESCE(description, "")) LIKE ?
					OR LOWER(patient_first_name) LIKE ?
					OR LOWER(patient_last_name) LIKE ?
					OR LOWER(assigned_to_name) LIKE ?
				)`,
			);
			const term = `%${query.search.toLowerCase()}%`;
			filterParams.push(term, term, term, term, term);
		}
		if (query.patientId) {
			conditions.push("patient_id = ?");
			filterParams.push(query.patientId);
		}
		if (query.assignedToId) {
			conditions.push("assigned_to_id = ?");
			filterParams.push(query.assignedToId);
		}
		if (query.status) {
			conditions.push("status = ?");
			filterParams.push(query.status);
		}
		if (query.priority) {
			conditions.push("priority = ?");
			filterParams.push(query.priority);
		}
		if (query.category) {
			conditions.push("category = ?");
			filterParams.push(query.category);
		}
		if (query.dueDateFrom) {
			conditions.push("due_date >= ?");
			filterParams.push(query.dueDateFrom);
		}
		if (query.dueDateTo) {
			conditions.push("due_date <= ?");
			filterParams.push(query.dueDateTo);
		}

		const whereClause = conditions.length
			? `WHERE ${conditions.join(" AND ")}`
			: "";
		const total = db
			.prepare(`SELECT COUNT(*) as total FROM task ${whereClause}`)
			.get(...filterParams) as { total: number };

		const params = [...filterParams];
		let paginationClause = "";
		if (query.limit !== undefined) {
			paginationClause = "LIMIT ?";
			params.push(query.limit);
			if (query.offset !== undefined) {
				paginationClause += " OFFSET ?";
				params.push(query.offset);
			}
		} else if (query.offset !== undefined) {
			paginationClause = "LIMIT -1 OFFSET ?";
			params.push(query.offset);
		}
		const rows = db
			.prepare(`SELECT * FROM task ${whereClause} ${paginationClause}`)
			.all(...params) as Array<Record<string, unknown>>;

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
