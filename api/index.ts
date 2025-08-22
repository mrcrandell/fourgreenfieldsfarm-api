// api/index.ts
import "reflect-metadata";
import { AppDataSource } from "../src/data-source";
import { createExpressServer, Action } from "routing-controllers";
import { ContactController } from "../src/controllers/contact.controller";
import { EventController } from "../src/controllers/event.controller";
import { EventImportController } from "../src/controllers/event-import.controller";
import { UserController } from "../src/controllers/user.controller";
import { ValidationErrorHandler } from "../src/middleware/ValidationErrorHandler";
import * as jwt from "jsonwebtoken";
import cors from "cors";

let dataSourceInitialized = false;
let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  // Initialize DB only once per cold start
  if (!dataSourceInitialized) {
    try {
      await AppDataSource.initialize();
      dataSourceInitialized = true;
      console.log("Data Source initialized!");
    } catch (error) {
      console.error("DB init error:", error);
      return res.status(500).send("Database initialization failed");
    }
  }

  // Cache Express app so we don’t recreate on every request
  if (!cachedApp) {
    const isLocal = process.env.NODE_ENV === "development";
    const allowedOrigin = isLocal ? "*" : process.env.FRONTEND_URL;

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

    // Apply CORS
    app.use(
      cors({
        origin: allowedOrigin,
        credentials: true,
      })
    );

    cachedApp = app;
  }

  // Call Express handler
  return cachedApp(req, res);
}
