import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialTemperatureSchema1735000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`sensor_thresholds\` (
  \`singletonKey\` tinyint unsigned NOT NULL,
  \`coldBelowCelsius\` decimal(6,2) NOT NULL,
  \`hotFromCelsius\` decimal(6,2) NOT NULL,
  \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (\`singletonKey\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`);
    await queryRunner.query(`
INSERT INTO \`sensor_thresholds\` (\`singletonKey\`, \`coldBelowCelsius\`, \`hotFromCelsius\`, \`updatedAt\`)
VALUES (1, 22.00, 35.00, CURRENT_TIMESTAMP(6))
ON DUPLICATE KEY UPDATE \`coldBelowCelsius\` = \`coldBelowCelsius\`
`);
    await queryRunner.query(`
CREATE TABLE IF NOT EXISTS \`temperature_history\` (
  \`rowId\` bigint unsigned NOT NULL AUTO_INCREMENT,
  \`capturedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`celsius\` decimal(6,2) NOT NULL,
  \`state\` enum('COLD','WARM','HOT') NOT NULL,
  \`snapshotColdBelow\` decimal(6,2) NOT NULL,
  \`snapshotHotFrom\` decimal(6,2) NOT NULL,
  PRIMARY KEY (\`rowId\`),
  KEY \`IDX_temperature_history_captured_at\` (\`capturedAt\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `temperature_history`');
    await queryRunner.query('DROP TABLE IF EXISTS `sensor_thresholds`');
  }
}
