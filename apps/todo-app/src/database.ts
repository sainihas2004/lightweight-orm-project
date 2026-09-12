import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

import { createClient } from "@sai_nihas/lightweight-orm";
import { Todo } from "./models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env")
});

console.log("Database URL loaded:", !!process.env.DATABASE_URL);

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const driver = {
  async query<T>(
    text: string,
    values: unknown[] = []
  ): Promise<T[]> {
    const result = await pool.query(text, values);
    return result.rows as T[];
  }
};

export const db = createClient(
  {
    todo: Todo
  },
  driver
);

export { pool };