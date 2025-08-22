"use strict";

module.exports = class AddNewFieldToEvent1750728738909 {
    name = 'AddNewFieldToEvent1750728738909';

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "events" ADD "recurringEventId" character varying`);
        await queryRunner.query(`ALTER TABLE "events" ADD "recurrenceRule" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "recurrenceRule"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "recurringEventId"`);
    }
}