import { categories, priorities, roles, status } from "@medica/common";
import { z } from "zod";

const statusEnum = z.enum([
	status.cancelled,
	status.pending,
	status.in_progress,
	status.completed,
] as const);

const priorityEnum = z.enum([
	priorities.low,
	priorities.medium,
	priorities.high,
] as const);

const categoryEnum = z.enum([
	categories.medication,
	categories.therapy,
	categories.consultation,
	categories.examination,
	categories.surgery,
	categories.other,
] as const);

const roleEnum = z.enum([roles.doctor, roles.nurse, roles.therapist] as const);

export const PatientSchema = z.object({
	id: z.uuid(),
	firstName: z.string().min(1).max(100),
	lastName: z.string().min(1).max(100),
	dateOfBirth: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	roomNumber: z.string().min(1).max(10),
});

export const assignedToSchema = z.object({
	id: z.uuid(),
	name: z.string().min(1).max(100),
	role: roleEnum,
});

export const TaskSchema = z.object({
	id: z.uuid(),
	title: z.string().min(1).max(255),
	description: z.string().optional().nullable(),
	createdAt: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	updatedAt: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), {
			message: "Invalid date format",
		})
		.optional(),
	patient: PatientSchema,
	assignedTo: assignedToSchema,
	priority: priorityEnum,
	status: statusEnum,
	category: categoryEnum,
	dueDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
	notes: z.string().optional().nullable(),
});

export const GetTasksQuerySchema = z.object({
	search: z.string().min(1).optional(),
	patientId: z.uuid().optional(),
	assignedToId: z.uuid().optional(),
	status: statusEnum.optional(),
	priority: priorityEnum.optional(),
	category: categoryEnum.optional(),
	dueDateFrom: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), {
			message: "Invalid date format",
		})
		.optional(),
	dueDateTo: z
		.string()
		.refine((date) => !Number.isNaN(Date.parse(date)), {
			message: "Invalid date format",
		})
		.optional(),
	limit: z.coerce.number().int().min(0).optional(),
	offset: z.coerce.number().int().min(0).optional(),
});

export const GetTasksResponseSchema = z.object({
	data: z.array(TaskSchema),
	total: z.number().int().min(0),
});
