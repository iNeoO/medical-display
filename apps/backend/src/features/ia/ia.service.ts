import { GetTasksQuerySchema } from "../tasks/tasks.schema.js";
import type { GetTasksQuery } from "../tasks/tasks.type.js";
import { tasksFilter } from "./ia.prompts.js";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.1";

type OllamaGenerateResponse = {
	response: string;
};

const generate = async (prompt: string): Promise<string> => {
	const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: OLLAMA_MODEL,
			prompt,
			stream: false,
		}),
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Ollama error ${response.status}: ${body}`);
	}

	const data = (await response.json()) as OllamaGenerateResponse;
	return data.response.trim();
};

export const promptIa = async (prompt: string): Promise<unknown> => {
	const raw = await generate(tasksFilter(prompt));

	try {
		return JSON.parse(raw);
	} catch (_error) {
		console.error("Failed to parse Ollama response:", raw);
		throw new Error(`Ollama returned invalid JSON: ${raw}`);
	}
};

export const PromptTasksFilter = async (
	prompt: string,
): Promise<GetTasksQuery> => {
	const raw = await generate(tasksFilter(prompt));
	try {
		return GetTasksQuerySchema.parse(JSON.parse(raw));
	} catch (_error) {
		console.error("Failed to parse Ollama response:", raw);
		throw new Error(`Ollama returned JSON that does not match schema: ${raw}`);
	}
};
