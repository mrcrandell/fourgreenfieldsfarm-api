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

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
