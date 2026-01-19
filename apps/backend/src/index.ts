import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { init as initDb } from "./db/index.js";
import iaController from "./features/ia/ia.controller.js";
import tasksController from "./features/tasks/tasks.controller.js";

const app = new Hono();

initDb();

app.route("/tasks", tasksController).route("/ia", iaController);

const server = serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

const gracefulShutdown = async (signal: string) => {
	console.log(`${signal} received. Graceful shutdown initiated.`);
	await new Promise<void>((resolve, reject) => {
		server.close((err) => {
			if (err) {
				reject(err);
			} else {
				console.log("HTTP server closed");
				resolve();
			}
		});
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
