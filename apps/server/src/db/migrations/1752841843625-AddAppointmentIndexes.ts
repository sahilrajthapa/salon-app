import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointmentIndexes1752841843625 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX idx_appointments_client_date 
      ON appointments(client_id, date)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX idx_appointments_client_date
    `);
  }
}
