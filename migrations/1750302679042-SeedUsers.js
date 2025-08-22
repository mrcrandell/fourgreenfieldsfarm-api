"use strict";
const argon2 = require("argon2");
const dotenv = require("dotenv");
dotenv.config();

module.exports = class SeedUsers1750302679042 {
    name = 'SeedUsers1750302679042';

    async up(queryRunner) {
        const plainPassword = process.env.DEFAULT_USER_PASSWORD || "changeme";
        const passwordHash = await argon2.hash(plainPassword);

        await queryRunner.query(
            `INSERT INTO "user" (id, name, email, password) VALUES
            ('f7b3eb6a-4d78-11f0-9fe2-0242ac120002', 'Matt Crandell', 'me@mattcrandell.com', $1),
            ('fe34b668-4d78-11f0-9fe2-0242ac120002', 'Kevin Courtney', 'fourgreenfieldsman@yahoo.com', $1)`,
            [passwordHash]
        );
    }

    async down(queryRunner) {
        await queryRunner.query(
            `DELETE FROM "user" WHERE id IN ('f7b3eb6a-4d78-11f0-9fe2-0242ac120002', 'fe34b668-4d78-11f0-9fe2-0242ac120002')`
        );
    }
}