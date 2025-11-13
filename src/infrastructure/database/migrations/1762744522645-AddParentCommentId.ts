import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentCommentId1762744522645 implements MigrationInterface {
    name = 'AddParentCommentId1762744522645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`story_comments\` ADD \`parent_comment_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`story_comments\` ADD CONSTRAINT \`FK_4d0839f3ae8f42d283350f48367\` FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`story_comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`story_comments\` DROP FOREIGN KEY \`FK_4d0839f3ae8f42d283350f48367\``);
        await queryRunner.query(`ALTER TABLE \`story_comments\` DROP COLUMN \`parent_comment_id\``);
    }

}
