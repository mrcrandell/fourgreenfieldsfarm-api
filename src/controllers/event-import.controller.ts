// src/controllers/eventImport.controller.ts
import {
  JsonController,
  Post,
  Authorized,
  Res,
  Req,
} from "routing-controllers";
import { Response, Request } from "express";
import multer from "multer";
import csv from "csv-parser";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { Readable } from "stream";
import { parse } from "date-fns";

const upload = multer({ storage: multer.memoryStorage() });

@JsonController("/events")
export class EventImportController {
  @Post("/import")
  @Authorized()
  async importCsv(@Req() req: Request, @Res() res: Response) {
    // Manually call multer
    await new Promise<void>((resolve, reject) => {
      upload.single("file")(req as any, res as any, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const repo = AppDataSource.getRepository(Event);
    const results: string[] = [];

    const parser = Readable.from(file.buffer).pipe(csv());

    for await (const row of parser) {
      const existing = await repo.findOneBy({
        slug: row.slug,
        startsAt: parse(row.starts_at, "yyyy-MM-dd HH:mm:ss", new Date()),
      });

      const eventData = {
        name: row.name,
        slug: row.slug,
        startsAt: parse(row.starts_at, "yyyy-MM-dd HH:mm:ss", new Date()),
        endsAt: parse(row.ends_at, "yyyy-MM-dd HH:mm:ss", new Date()),
        description: row.description || null,
        isFeatured: row.is_featured === "1",
        isHasEndsAt: row.is_has_ends_at === "1",
        isAllDay: row.is_all_day === "1",
        isActive: row.is_active === "1",
        hauntedBy: row.haunted_by || null,
      };

      if (existing) {
        repo.merge(existing, eventData);
        await repo.save(existing);
        results.push(`Updated ${row.name} @ ${row.starts_at}`);
      } else {
        const newEvent = repo.create(eventData);
        await repo.save(newEvent);
        results.push(`Created ${row.name} @ ${row.starts_at}`);
      }
    }

    return res.json({
      message: `Imported ${results.length} events`,
      results,
    });
  }
}
