import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReleaseNotesColumns1766708176444 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar y agregar columna 'type' si no existe
        const hasTypeColumn = await queryRunner.hasColumn('release_notes', 'type');
        if (!hasTypeColumn) {
            await queryRunner.query(`
                ALTER TABLE release_notes ADD COLUMN type varchar(20) DEFAULT 'minor' NOT NULL
            `);
            console.log('✅ Column "type" added to release_notes table');
        }

        // Verificar y agregar columna 'isPublished' si no existe
        const hasIsPublishedColumn = await queryRunner.hasColumn('release_notes', 'isPublished');
        if (!hasIsPublishedColumn) {
            await queryRunner.query(`
                ALTER TABLE release_notes ADD COLUMN isPublished boolean DEFAULT true NOT NULL
            `);
            console.log('✅ Column "isPublished" added to release_notes table');
        }

        // Verificar y agregar columna 'priority' si no existe
        const hasPriorityColumn = await queryRunner.hasColumn('release_notes', 'priority');
        if (!hasPriorityColumn) {
            await queryRunner.query(`
                ALTER TABLE release_notes ADD COLUMN priority int DEFAULT 0 NOT NULL
            `);
            console.log('✅ Column "priority" added to release_notes table');
        }

        // Verificar y agregar columna 'releaseDate' si no existe
        const hasReleaseDateColumn = await queryRunner.hasColumn('release_notes', 'releaseDate');
        if (!hasReleaseDateColumn) {
            await queryRunner.query(`
                ALTER TABLE release_notes ADD COLUMN releaseDate date NULL
            `);
            console.log('✅ Column "releaseDate" added to release_notes table');
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las columnas en orden inverso
        const hasReleaseDateColumn = await queryRunner.hasColumn('release_notes', 'releaseDate');
        if (hasReleaseDateColumn) {
            await queryRunner.query(`ALTER TABLE release_notes DROP COLUMN releaseDate`);
        }

        const hasPriorityColumn = await queryRunner.hasColumn('release_notes', 'priority');
        if (hasPriorityColumn) {
            await queryRunner.query(`ALTER TABLE release_notes DROP COLUMN priority`);
        }

        const hasIsPublishedColumn = await queryRunner.hasColumn('release_notes', 'isPublished');
        if (hasIsPublishedColumn) {
            await queryRunner.query(`ALTER TABLE release_notes DROP COLUMN isPublished`);
        }

        const hasTypeColumn = await queryRunner.hasColumn('release_notes', 'type');
        if (hasTypeColumn) {
            await queryRunner.query(`ALTER TABLE release_notes DROP COLUMN type`);
        }
    }

}
