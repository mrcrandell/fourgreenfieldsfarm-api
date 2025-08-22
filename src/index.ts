import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { createExpressServer, Action } from "routing-controllers";
import { ContactController } from "./controllers/contact.controller";
import { EventController } from "./controllers/event.controller";
import { EventImportController } from "./controllers/event-import.controller";
import { UserController } from "./controllers/user.controller";
import { ValidationErrorHandler } from "./middleware/ValidationErrorHandler";
import * as jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const isLocal = process.env.NODE_ENV === "development";
const allowedOrigin = isLocal ? "*" : process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);
app.use(express.json());
const { PORT = 3000 } = process.env;

const useUrl = !!process.env.DATABASE_URL;
console.log("Connecting to DB:", useUrl ? process.env.DATABASE_URL: process.env.DB_NAME);

AppDataSource.initialize()
  .then(async () => {
    const app = createExpressServer({
      controllers: [
        ContactController,
        EventController,
        EventImportController,
        UserController,
      ],
      routePrefix: "/api",
      middlewares: [ValidationErrorHandler],
      validation: true,
      defaultErrorHandler: false,
      authorizationChecker: async (action: Action) => {
        const token = action.request.headers["authorization"]?.split(" ")[1];
        if (!token) return false;

        try {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret"
          );
          action.request.user = payload;
          return true;
        } catch {
          return false;
        }
      },
    });
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
