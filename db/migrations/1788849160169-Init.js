/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Init1788849160169 {
    name = 'Init1788849160169'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "contact_info" character varying(255), "email" character varying(100), "role" character varying(20) NOT NULL DEFAULT 'USER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_51b8b26ac168fbe7d6f5653e6cf" UNIQUE ("name"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cards" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "english_name" character varying(100) NOT NULL, "image_url" character varying(100) NOT NULL, CONSTRAINT "UQ_6077bbed1f2d46517bb4f77d134" UNIQUE ("name"), CONSTRAINT "UQ_fe895ef7398d231e63b69ecc827" UNIQUE ("english_name"), CONSTRAINT "UQ_7cd7f0d3debf8cad4fdf343fef6" UNIQUE ("image_url"), CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "genshin_uid" character varying(50) NOT NULL, "status" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "card_id" integer NOT NULL, CONSTRAINT "UQ_user_card_pair" UNIQUE ("user_id", "card_id"), CONSTRAINT "PK_8803d810c730191425d124af1ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_cards" ADD CONSTRAINT "FK_fd1dbad94a6a2ccfc149c819076" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_cards" ADD CONSTRAINT "FK_a228f872c29059934696c9d4b61" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_cards" DROP CONSTRAINT "FK_a228f872c29059934696c9d4b61"`);
        await queryRunner.query(`ALTER TABLE "user_cards" DROP CONSTRAINT "FK_fd1dbad94a6a2ccfc149c819076"`);
        await queryRunner.query(`DROP TABLE "user_cards"`);
        await queryRunner.query(`DROP TABLE "cards"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
