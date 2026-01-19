import { z } from "zod";
import { GetTasksQuerySchema } from "../tasks/tasks.schema.js";

export const GetSearchRequestSchema = z.object({
	prompt: z.string().min(1).max(1000),
});

export const GetSearchResponseSchema = z.object({
	filters: GetTasksQuerySchema,
});
