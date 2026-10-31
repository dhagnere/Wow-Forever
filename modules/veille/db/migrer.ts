import { readFile } from "node:fs/promises";
import path from "node:path";
import { pool } from "./pool";

export async function migrer(): Promise<void> {
  const sql = await readFile(path.join(process.cwd(), "modules/veille/db/schema.sql"), "utf8");
  await pool().query(sql);
}
