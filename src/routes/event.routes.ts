import { Router } from "express";
import { createEvent, getAllEvents } from "../controllers/event.controller";

const router = Router();

router.get("/", getAllEvents);
router.post("/", createEvent);

export { router as eventRouter };
