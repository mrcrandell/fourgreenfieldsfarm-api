import { MigrationInterface, QueryRunner } from "typeorm";
import * as argon2 from "argon2";
import * as dotenv from "dotenv";
// Load environment variables
dotenv.config();

export class SeedUsers1750302679042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const plainPassword = process.env.DEFAULT_USER_PASSWORD || "changeme";
    const passwordHash = await argon2.hash(plainPassword);

    await queryRunner.query(
      `INSERT INTO "user" (id, name, email, password) VALUES
        ('f7b3eb6a-4d78-11f0-9fe2-0242ac120002', 'Matt Crandell', 'mrcrandell@gmail.com', $1),
        ('fe34b668-4d78-11f0-9fe2-0242ac120002', 'Kevin Courtney', 'fourgreenfieldsman@yahoo.com', $1)`,
      [passwordHash]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user" WHERE id IN ('f7b3eb6a-4d78-11f0-9fe2-0242ac120002', 'fe34b668-4d78-11f0-9fe2-0242ac120002')`
    );
  }
}
