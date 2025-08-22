import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import { Event } from "./entity/Event";
import { User } from "./entity/User";

const useUrl = !!process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  useUrl
    ? {
        type: "postgres",
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        synchronize: false,
        logging: true,
        entities: [Event, User],
        migrations: ["migrations/*.js"],
      }
    : {
        type: "postgres",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: false,
        logging: true,
        entities: [Event, User],
        migrations: ["migrations/*.js"],
      }
);
