import fs from "node:fs";
import { Scalar } from "@scalar/hono-api-reference";
import type { Hono } from "hono";
import { generateSpecs, openAPIRouteHandler } from "hono-openapi";

export function setupOpenAPI<T extends { Variables: Record<string, unknown> }>(
	app: Hono<T>,
) {
	app.get(
		"/openapi/spec",
		openAPIRouteHandler(app, {
			documentation: {
				info: {
					title: "Swagger",
					version: "1.0.0",
					description: "Swagger API",
				},
			},
		}),
	);

	app.get(
		"/openapi/ui",
		Scalar({
			theme: "deepSpace",
			url: `/openapi/spec`,
		}),
	);
}

export async function generateSwaggerDocs<
	T extends { Variables: Record<string, unknown> },
>(app: Hono<T>) {
	setupOpenAPI(app);
	const spec = await generateSpecs(app);
	const pathToSpec = "./src/openAPI.json";
	fs.writeFileSync(pathToSpec, JSON.stringify(spec, null, 2));
}
