import { DataSource, QueryRunner } from 'typeorm';

export async function truncateTables(dataSource: DataSource): Promise<void> {
  const queryRunner: QueryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.query('TRUNCATE TABLE `temperature_history`');
    await queryRunner.query('TRUNCATE TABLE `sensor_thresholds`');
  } finally {
    await queryRunner.release();
  }
}
