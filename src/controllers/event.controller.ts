// filepath: src/controllers/event.controller.ts
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
import { AppDataSource } from "../data-source";
import { Event } from "../entity/Event";
import { format, parseISO } from "date-fns";

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
    const event = repo.create({
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    });
    return repo.save(event);
  }

  @Put("/:id")
  async update(
    @Param("id") id: string,
    @Body({ validate: true }) body: UpdateEventBody
  ) {
    const repo = AppDataSource.getRepository(Event);
    const event = await repo.findOneBy({ id });
    if (!event) throw new NotFoundError("Event not found");

    // Convert date strings to Date objects if present
    if (body.startsAt) body.startsAt = new Date(body.startsAt) as any;
    if (body.endsAt) body.endsAt = new Date(body.endsAt) as any;

    repo.merge(event, body);
    return repo.save(event);
  }
}
