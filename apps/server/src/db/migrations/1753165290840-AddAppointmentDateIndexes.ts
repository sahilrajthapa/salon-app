import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointmentDateIndexes1753165290840
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_appointments_date 
      ON appointments(date)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_appointments_date
    `);
  }
}
