import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762728427742 implements MigrationInterface {
    name = 'InitialSchema1762728427742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`bio\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`cover_image\` varchar(255) NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`is_public\` tinyint NOT NULL DEFAULT 1, \`views_count\` int NOT NULL DEFAULT '0', \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`story_tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag_name\` varchar(255) NOT NULL, \`story_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`story_likes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`story_id\` int NOT NULL, \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4c05956e2f1fe1a23339a255cc\` (\`story_id\`, \`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`story_comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`comment\` text NOT NULL, \`story_id\` int NOT NULL, \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chapters\` (\`id\` int NOT NULL AUTO_INCREMENT, \`chapter_number\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`image\` varchar(255) NULL, \`story_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`stories\` ADD CONSTRAINT \`FK_ab4ee230faf536e7c5aee12f4ea\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`story_tags\` ADD CONSTRAINT \`FK_818bd0326f1417b77cb55f0b80f\` FOREIGN KEY (\`story_id\`) REFERENCES \`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`story_likes\` ADD CONSTRAINT \`FK_a68f51aa0d901bbc019c65572b3\` FOREIGN KEY (\`story_id\`) REFERENCES \`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`story_likes\` ADD CONSTRAINT \`FK_7743f7540a7b66554a614e181e4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`story_comments\` ADD CONSTRAINT \`FK_e10ceb785191acc262e9f54ddb8\` FOREIGN KEY (\`story_id\`) REFERENCES \`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`story_comments\` ADD CONSTRAINT \`FK_ee42f9f8d70f8b12ea742c4ecaa\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chapters\` ADD CONSTRAINT \`FK_728a399398eaeec7bebbb6c8de9\` FOREIGN KEY (\`story_id\`) REFERENCES \`stories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chapters\` DROP FOREIGN KEY \`FK_728a399398eaeec7bebbb6c8de9\``);
        await queryRunner.query(`ALTER TABLE \`story_comments\` DROP FOREIGN KEY \`FK_ee42f9f8d70f8b12ea742c4ecaa\``);
        await queryRunner.query(`ALTER TABLE \`story_comments\` DROP FOREIGN KEY \`FK_e10ceb785191acc262e9f54ddb8\``);
        await queryRunner.query(`ALTER TABLE \`story_likes\` DROP FOREIGN KEY \`FK_7743f7540a7b66554a614e181e4\``);
        await queryRunner.query(`ALTER TABLE \`story_likes\` DROP FOREIGN KEY \`FK_a68f51aa0d901bbc019c65572b3\``);
        await queryRunner.query(`ALTER TABLE \`story_tags\` DROP FOREIGN KEY \`FK_818bd0326f1417b77cb55f0b80f\``);
        await queryRunner.query(`ALTER TABLE \`stories\` DROP FOREIGN KEY \`FK_ab4ee230faf536e7c5aee12f4ea\``);
        await queryRunner.query(`DROP TABLE \`chapters\``);
        await queryRunner.query(`DROP TABLE \`story_comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c05956e2f1fe1a23339a255cc\` ON \`story_likes\``);
        await queryRunner.query(`DROP TABLE \`story_likes\``);
        await queryRunner.query(`DROP TABLE \`story_tags\``);
        await queryRunner.query(`DROP TABLE \`stories\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
