import { Hono } from "hono";
import { validator as zValidator } from "hono-openapi";
import { GetRouteTasks } from "./tasks.route.js";
import { GetTasksQuerySchema } from "./tasks.schema.js";
import { getTasks } from "./tasks.service.js";

const app = new Hono().get(
	"/",
	GetRouteTasks(),
	zValidator("query", GetTasksQuerySchema),
	async (c) => {
		const query = c.req.valid("query");
		const { tasks, total } = getTasks(query);
		return c.json({
			data: tasks,
			total: total,
		});
	},
);

export default app;
