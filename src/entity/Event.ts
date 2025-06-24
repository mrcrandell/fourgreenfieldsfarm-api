import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  slug!: string;

  @Column({ type: "timestamptz" })
  startsAt!: Date;

  @Column({ type: "timestamptz" })
  endsAt!: Date;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column({ default: false })
  isHasEndsAt!: boolean;

  @Column({ default: false })
  isAllDay!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  hauntedBy!: string;

  @Column({ nullable: true })
  recurringEventId?: string; // references another Event ID

  @Column({ nullable: true })
  recurrenceRule?: string; // e.g. "FREQ=WEEKLY;BYDAY=WE;UNTIL=20251217"

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
