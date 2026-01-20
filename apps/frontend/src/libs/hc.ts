import type { AppType } from "@medical-display/backend/hc";
import { hc } from "hono/client";

export const client = hc<AppType>("/api");
