/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class DropUserCardsUpdatedAt1789101814042 {
    name = 'DropUserCardsUpdatedAt1789101814042'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" DROP COLUMN "updated_at"`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }
}
