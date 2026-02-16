// Ejemplo de uso de better-sqlite3
import Database from 'better-sqlite3';

const db = new Database('db.sqlite');

// Crear tabla de ejemplo si no existe
// db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)').run();

export default db;
