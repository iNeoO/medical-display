import { categories, priorities, roles, status } from "@medical-display/common";
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
  priorities.urgent,
] as const);

const categoryEnum = z.enum([
  categories.medication,
  categories.therapy,
  categories.consultation,
  categories.examination,
  categories.surgery,
  categories.other,
  categories.urgent,
  categories.follow_up,
  categories.administrative,
] as const);

const roleEnum = z.enum([
  roles.doctor,
  roles.nurse,
  roles.therapist,
  roles.specialist,
  roles.intern,
] as const);

export const PatientSchema = z.object({
  id: z.uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  roomNumber: z.string().min(1).max(10).optional(),
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

export const GetTasksQuerySchema = z
  .object({
    search: z.string().min(1).optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
    category: categoryEnum.optional(),
    "assignedTo.name": z.string().min(1).optional(),
    "assignedTo.role": roleEnum.optional(),
    "patient.firstName": z.string().min(1).optional(),
    "patient.lastName": z.string().min(1).optional(),
    "patient.roomNumber": z.string().min(1).optional(),
    "dueDate.from": z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional(),
    "dueDate.to": z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional(),
    limit: z.coerce.number().int().min(0).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  })
  .optional();

export const GetTasksResponseSchema = z.object({
  data: z.array(TaskSchema),
  total: z.number().int().min(0),
});
