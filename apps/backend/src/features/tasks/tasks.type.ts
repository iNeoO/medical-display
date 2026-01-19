import type { z } from "zod";
import type { GetTasksQuerySchema, TaskSchema } from "./tasks.schema.js";

export type Task = z.infer<typeof TaskSchema>;
export type GetTasksQuery = z.infer<typeof GetTasksQuerySchema>;
