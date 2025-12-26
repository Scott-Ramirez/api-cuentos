import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReleaseNotesTable1766701864366 implements MigrationInterface {
    name = 'CreateReleaseNotesTable1766701864366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`active\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`metadata\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`type\` varchar(20) NOT NULL DEFAULT 'minor'`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`isPublished\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`releaseDate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`version\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`version\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`priority\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`priority\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`priority\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`priority\` varchar(50) NOT NULL DEFAULT 'medium'`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`version\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`version\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`releaseDate\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`isPublished\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`metadata\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`expiresAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`release_notes\` ADD \`active\` tinyint NOT NULL DEFAULT '1'`);
    }

}
