import { describeRoute, resolver } from "hono-openapi";
import { GetTasksResponseSchema } from "./tasks.schema.js";

export const GetRouteTasks = () =>
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(GetTasksResponseSchema),
					},
				},
			},
		},
	});
