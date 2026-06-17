import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname } from "path";
import { SCHEMA } from "./schema.js";

const dbPath = process.env.DB_PATH ?? "./data/newsletters.db";
mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");
db.run(SCHEMA);

export { db };
