import {
  JsonController,
  Get,
  Post,
  QueryParams,
  Authorized,
  Body,
  Param,
  Put,
  NotFoundError,
} from "routing-controllers";
import {
  IsInt,
  IsOptional,
  IsISO8601,
  Min,
  IsString,
  Length,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { format, parseISO } from "date-fns";
import { RRule } from "rrule";
import { v4 as uuidv4 } from "uuid";

class EventQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsISO8601()
  startsAt?: string;

  @IsOptional()
  @IsISO8601()
  endsAt?: string;
}

// Custom validator to ensure endsAt > startsAt
@ValidatorConstraint({ name: "isEndsAfterStarts", async: false })
class IsEndsAfterStarts implements ValidatorConstraintInterface {
  validate(endsAt: string, args: ValidationArguments) {
    const { startsAt } = args.object as any;
    if (!startsAt || !endsAt) return true;
    return new Date(endsAt) > new Date(startsAt);
  }
  defaultMessage(args: ValidationArguments) {
    return "endsAt must be after startsAt";
  }
}

class GroupedEventQueryParams {
  @IsOptional()
  @IsISO8601()
  startsAt?: string;

  @IsOptional()
  @IsISO8601()
  endsAt?: string;
}

class CreateEventBody {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsString()
  @Length(1, 255)
  slug!: string;

  @IsISO8601()
  startsAt!: string;

  @IsISO8601()
  @Validate(IsEndsAfterStarts)
  endsAt!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsBoolean()
  isFeatured!: boolean;

  @IsBoolean()
  isHasEndsAt!: boolean;

  @IsBoolean()
  isAllDay!: boolean;

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  hauntedBy?: string;

  @IsOptional()
  @IsString()
  recurrenceRule?: string; // e.g. "FREQ=WEEKLY;BYDAY=WE;UNTIL=20251217"
}

class UpdateEventBody {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  slug?: string;

  @IsOptional()
  @IsISO8601()
  startsAt?: string;

  @IsOptional()
  @IsISO8601()
  @Validate(IsEndsAfterStarts)
  endsAt?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isHasEndsAt?: boolean;

  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  hauntedBy?: string;

  @IsOptional()
  @IsString()
  scope?: "single" | "future" | "all";
}

@JsonController("/events")
export class EventController {
  @Get("/")
  async getAll(@QueryParams({ validate: true }) query: EventQueryParams) {
    const repo = AppDataSource.getRepository(Event);

    const qb = repo
      .createQueryBuilder("event")
      .orderBy("event.startsAt", "ASC");

    if (query.startsAt) {
      qb.andWhere("event.startsAt >= :startsAt", {
        startsAt: parseISO(query.startsAt),
      });
    }
    if (query.endsAt) {
      qb.andWhere("event.endsAt <= :endsAt", {
        endsAt: parseISO(query.endsAt),
      });
    }
    if (query.limit !== undefined) {
      qb.take(query.limit);
    }
    if (query.offset !== undefined) {
      qb.skip(query.offset);
    }

    return qb.getMany();
  }

  @Get("/by-day")
  async getByDay(
    @QueryParams({ validate: true }) query: GroupedEventQueryParams
  ) {
    const repo = AppDataSource.getRepository(Event);

    const qb = repo
      .createQueryBuilder("event")
      .orderBy("event.startsAt", "ASC");

    if (query.startsAt) {
      qb.andWhere("event.startsAt >= :startsAt", {
        startsAt: parseISO(query.startsAt),
      });
    }
    if (query.endsAt) {
      qb.andWhere("event.endsAt <= :endsAt", {
        endsAt: parseISO(query.endsAt),
      });
    }

    const events = await qb.getMany();

    // Group events by day label (e.g., "Saturday, October 25, 2025")
    const grouped: Array<{ day: string; dayOfMonth: number; events: Event[] }> =
      [];
    const map = new Map<string, { dayOfMonth: number; events: Event[] }>();

    for (const event of events) {
      const dateObj =
        typeof event.startsAt === "string"
          ? parseISO(event.startsAt)
          : event.startsAt;
      const dayLabel = format(dateObj, "EEEE, MMMM d, yyyy");
      const dayOfMonth = dateObj.getDate();
      if (!map.has(dayLabel)) map.set(dayLabel, { dayOfMonth, events: [] });
      map.get(dayLabel)!.events.push(event);
    }

    for (const [day, { dayOfMonth, events }] of map.entries()) {
      grouped.push({ day, dayOfMonth, events });
    }

    // Optionally, sort by day
    grouped.sort((a, b) => {
      const aDate =
        typeof a.events[0].startsAt === "string"
          ? parseISO(a.events[0].startsAt)
          : a.events[0].startsAt;
      const bDate =
        typeof b.events[0].startsAt === "string"
          ? parseISO(b.events[0].startsAt)
          : b.events[0].startsAt;
      return aDate.getTime() - bDate.getTime();
    });

    return grouped;
  }

  @Post("/")
  @Authorized()
  async create(@Body({ validate: true }) body: CreateEventBody) {
    const repo = AppDataSource.getRepository(Event);

    const baseStartsAt = new Date(body.startsAt);
    const baseEndsAt = new Date(body.endsAt);

    if (!body.recurrenceRule) {
      // Single event only
      const event = repo.create({
        ...body,
        startsAt: baseStartsAt,
        endsAt: baseEndsAt,
      });
      return repo.save(event);
    }

    // Create recurrence rule
    const rule = RRule.fromString(body.recurrenceRule);
    const repeatDates = rule.all(); // array of Date objects

    // Generate a UUID for the "master" event ID
    const masterId = uuidv4();

    const duration = baseEndsAt.getTime() - baseStartsAt.getTime();

    const events = repeatDates.map((date) => {
      return repo.create({
        ...body,
        startsAt: date,
        endsAt: new Date(date.getTime() + duration),
        recurringEventId: masterId,
        recurrenceRule: body.recurrenceRule,
      });
    });

    return repo.save(events);
  }

  @Put("/:id")
  @Authorized()
  async update(
    @Param("id") id: string,
    @Body({ validate: true }) body: UpdateEventBody
  ) {
    const repo = AppDataSource.getRepository(Event);
    const event = await repo.findOneBy({ id });
    if (!event) throw new NotFoundError("Event not found");

    const scope = (body as any).scope ?? "single"; // default to single if not provided
    delete (body as any).scope; // clean it off so it doesn't merge

    // Prepare updates
    const updatedFields = { ...body };
    if (updatedFields.startsAt)
      updatedFields.startsAt = new Date(updatedFields.startsAt) as any;
    if (updatedFields.endsAt)
      updatedFields.endsAt = new Date(updatedFields.endsAt) as any;

    if (scope === "single") {
      repo.merge(event, updatedFields);
      return repo.save(event);
    }

    // Need to affect a group
    if (!event.recurringEventId) {
      // Not a repeating event — fallback to single edit
      repo.merge(event, updatedFields);
      return repo.save(event);
    }

    const events = await repo.find({
      where:
        scope === "future"
          ? {
              recurringEventId: event.recurringEventId,
              startsAt: MoreThanOrEqual(event.startsAt),
            }
          : {
              recurringEventId: event.recurringEventId,
            },
      order: {
        startsAt: "ASC",
      },
    });

    const updated = events.map((e) => {
      return repo.merge(e, updatedFields);
    });

    return repo.save(updated);
  }
}
