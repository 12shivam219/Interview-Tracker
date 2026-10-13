import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL must be configured");

const migration = await readFile(
  new URL("../db/migrations/0001_initial.sql", import.meta.url),
  "utf8",
);
const statements = migration
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);
const sql = neon(databaseUrl);
await sql.transaction(statements.map((statement) => sql.query(statement)));
console.log("Neon schema is ready.");