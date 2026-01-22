import { Scalar } from "@scalar/hono-api-reference";
import type { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

export function setupOpenAPI(app: Hono) {
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
      url: `/api/openapi/spec`,
    }),
  );
}
