import { describeRoute, resolver } from "hono-openapi";
import { GetSearchResponseSchema } from "./ia.schema.js";

export const GetRouteSearch = () =>
	describeRoute({
		responses: {
			200: {
				description: "Successful response",
				content: {
					"application/json": {
						schema: resolver(GetSearchResponseSchema),
					},
				},
			},
		},
	});
