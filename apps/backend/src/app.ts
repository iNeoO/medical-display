import { Hono } from "hono";
import tasksController from "./features/tasks/tasks.controller.js";
import iaController from "./features/ia/ia.controller.js";

const app = new Hono()
  .route("/tasks", tasksController)
  .route("/ia", iaController);

export default app;
