import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import * as dotenv from "dotenv";
// import cors from "cors";
import { createExpressServer, Action } from "routing-controllers";
import { ContactController } from "./controllers/contact.controller";
import { EventController } from "./controllers/event.controller";
import { EventImportController } from "./controllers/event-import.controller";
import { UserController } from "./controllers/user.controller";
import { ValidationErrorHandler } from "./middleware/ValidationErrorHandler";
import * as jwt from "jsonwebtoken";
dotenv.config();

const app = express();
app.use(express.json());
// app.use(errorHandler);
const { PORT = 3000 } = process.env;
// app.use(cors());

/* app.all("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
}); */

console.log("Connecting to DB:", process.env.DB_NAME);

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
      authorizationChecker: async (action: Action, roles: string[]) => {
        const token = action.request.headers["authorization"]?.split(" ")[1];
        if (!token) return false;

        try {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET || "your_jwt_secret"
          );
          // Optionally check roles here
          // if (roles.length && !roles.includes(payload.role)) return false;
          action.request.user = payload; // Attach user to request if needed
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
