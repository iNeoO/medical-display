import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { TaskSchema } from "../features/tasks/tasks.schema.js";

const dbPath = path.resolve(process.cwd(), "medica.db");
const isNewDb = !fs.existsSync(dbPath);
export const db: Database.Database = new Database(dbPath);
db.pragma("journal_mode = WAL");

const init = () => {
  db.exec(`
		CREATE TABLE IF NOT EXISTS task (
			id TEXT PRIMARY KEY,
			title TEXT NOT NULL,
			description TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT,
			patient_id TEXT NOT NULL,
			patient_first_name TEXT NOT NULL,
			patient_last_name TEXT NOT NULL,
			patient_date_of_birth TEXT NOT NULL,
			patient_room_number TEXT NOT NULL,
			assigned_to_id TEXT NOT NULL,
			assigned_to_name TEXT NOT NULL,
			assigned_to_role TEXT NOT NULL,
			priority TEXT NOT NULL,
			status TEXT NOT NULL,
			category TEXT NOT NULL,
			due_date TEXT NOT NULL,
			notes TEXT
		)
	`);
  db.exec("DELETE FROM task");

  const insert = db.prepare(
    `INSERT OR IGNORE INTO task (
			id,
			title,
			description,
			created_at,
			updated_at,
			patient_id,
			patient_first_name,
			patient_last_name,
			patient_date_of_birth,
			patient_room_number,
			assigned_to_id,
			assigned_to_name,
			assigned_to_role,
			priority,
			status,
			category,
			due_date,
			notes
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const exists = db.prepare("SELECT 1 FROM task WHERE id = ? LIMIT 1");

  const insertMany = db.transaction((tasks: unknown[]) => {
    for (const item of tasks) {
      const parsed = TaskSchema.safeParse(item);
      if (!parsed.success) {
        console.log(item);
        console.warn("Invalid task skipped.", parsed.error);
        continue;
      }
      const task = parsed.data;
      if (exists.get(task.id)) {
        continue;
      }
      insert.run(
        task.id,
        task.title,
        task.description ?? null,
        task.createdAt,
        task.updatedAt ?? null,
        task.patient.id,
        task.patient.firstName,
        task.patient.lastName,
        task.patient.dateOfBirth,
        task.patient.roomNumber,
        task.assignedTo.id,
        task.assignedTo.name,
        task.assignedTo.role,
        task.priority,
        task.status,
        task.category,
        task.dueDate,
        task.notes ?? null,
      );
    }
  });

  const countRow = db.prepare("SELECT COUNT(*) as count FROM task").get() as {
    count: number;
  };
  const shouldSeed = isNewDb || countRow.count === 0;
  if (!shouldSeed) {
    return;
  }

  const seedPath = new URL("./Medical-Tasks.json", import.meta.url);
  try {
    const data = fs.readFileSync(seedPath, "utf8");
    const tasks = JSON.parse(data);
    if (!Array.isArray(tasks)) {
      throw new Error("Expected an array of tasks.");
    }
    insertMany(tasks);
    console.log("Import succeeded.");
  } catch (err) {
    console.error("Import failed.", err);
  }
};

export { init };
export default db;
