import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1750302679041 implements MigrationInterface {
    name = 'CreateInitialTables1750302679041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "description" text, "isFeatured" boolean NOT NULL DEFAULT false, "isHasEndsAt" boolean NOT NULL DEFAULT false, "isAllDay" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "hauntedBy" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "rememberToken" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "events"`);
    }

}
