import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToEvent1750728738909 implements MigrationInterface {
    name = 'AddNewFieldToEvent1750728738909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "recurringEventId" character varying`);
        await queryRunner.query(`ALTER TABLE "events" ADD "recurrenceRule" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "recurrenceRule"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "recurringEventId"`);
    }

}
