// Configuración básica de TypeORM para SQLite
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true, // Cambia a false en producción
  logging: false,
  entities: [__dirname + "/entities/*.{js,ts}"]
});
