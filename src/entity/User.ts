import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  BaseEntity,
} from "typeorm";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  rememberToken?: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
