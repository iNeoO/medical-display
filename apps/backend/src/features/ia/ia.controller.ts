import { Hono } from "hono";
import { validator as zValidator } from "hono-openapi";
import { GetRouteSearch } from "./ia.route.js";
import { GetSearchRequestSchema } from "./ia.schema.js";
import { PromptTasksFilter } from "./ia.service.js";

const app = new Hono().get(
	"/search",
	GetRouteSearch(),
	zValidator("json", GetSearchRequestSchema),
	async (c) => {
		const { prompt } = c.req.valid("json");
		try {
			const result = await PromptTasksFilter(prompt);
			return c.json({ filters: result });
		} catch (error) {
			return c.json({ error }, 400);
		}
	},
);

export default app;
