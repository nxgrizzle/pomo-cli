import fs from "node:fs/promises";
import { join } from "path";
import { __dirname, DEFAULT_DB } from "./util.js";

const DB_PATH = join(__dirname, "..", "db.json");
export const getDB = async () => {
  try {
    const db = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(db);
  } catch {
    const db = await saveDB(DEFAULT_DB)
    return db
  }
};

export const getConfig = async () => {
  const db = await getDB();
  return db.config;
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return db;
};

export const updateConfig = async (data) => {
  const db = await getDB();
  db.config = data;
  await saveDB(db);
  return data;
};

export const insertPomo = async (data) => {
  const db = await getDB();
  db.pomos.push(data);

  await saveDB(db);
  return data;
};
