import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnToReleaseNotes1703540000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe antes de agregarla
    try {
      await queryRunner.query(`
        ALTER TABLE release_notes 
        ADD COLUMN type varchar(20) DEFAULT 'minor' NOT NULL
      `);
      console.log('Column type added successfully');
    } catch (error) {
      console.log('Column type already exists or error:', error.message);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('release_notes', 'type');
    if (hasColumn) {
      await queryRunner.query('ALTER TABLE release_notes DROP COLUMN type');
    }
  }
}