import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemSettingsTable1766116794157 implements MigrationInterface {
    name = 'CreateSystemSettingsTable1766116794157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`system_settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`key\` varchar(100) NOT NULL, \`value\` text NULL, \`type\` varchar(50) NOT NULL DEFAULT 'string', \`description\` varchar(255) NULL, \`category\` varchar(50) NOT NULL DEFAULT 'system', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b1b5bc664526d375c94ce9ad43\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b1b5bc664526d375c94ce9ad43\` ON \`system_settings\``);
        await queryRunner.query(`DROP TABLE \`system_settings\``);
    }

}
