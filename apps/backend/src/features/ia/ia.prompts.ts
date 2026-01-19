export const tasksFilter = (
	sentence: string,
) => `You are generating query parameters for the tasks endpoint.
Return ONLY a JSON object that validates against this schema:
{
  search?: string,
  patientId?: string (uuid),
  assignedToId?: string (uuid),
  status?: "pending" | "in_progress" | "completed",
  priority?: "low" | "medium" | "high",
  category?: "medication" | "therapy" | "consultation",
  dueDateFrom?: string (ISO date),
  dueDateTo?: string (ISO date),
  limit?: number (integer >= 0),
  offset?: number (integer >= 0)
}
Rules:
- Output must be valid JSON with double quotes.
- Do not include keys not in the schema.
- Omit fields you cannot infer.
- Do not add explanations or markdown.
User request: ${sentence}`;
