import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReleaseNotesTable1766116132889 implements MigrationInterface {
    name = 'CreateReleaseNotesTable1766116132889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`release_notes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`version\` varchar(100) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`expiresAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`priority\` varchar(50) NOT NULL DEFAULT 'medium', \`metadata\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE \`release_notes\``);
    }

}
