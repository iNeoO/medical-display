import type { AppType } from "@medical-display/backend/hc";
import { hc } from "hono/client";

const serverBase = process.env.BACKEND_URI ?? "http://localhost:4000";
const baseUrl = typeof window === "undefined" ? `${serverBase}/api` : "/api";

export const client = hc<AppType>(baseUrl);
