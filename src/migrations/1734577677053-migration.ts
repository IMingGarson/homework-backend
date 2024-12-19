import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734577677053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`password\` VARCHAR(255) NOT NULL,
        \`role\` ENUM('admin', 'employee') NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` TIMESTAMP DEFAULT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE \`employees\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`user_id\` INT UNIQUE,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` TIMESTAMP DEFAULT NULL,
        CONSTRAINT \`FK_employee_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE \`reviews\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT,
        \`status\` ENUM('draft', 'active', 'completed') NOT NULL,
        \`employee_id\` INT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` TIMESTAMP DEFAULT NULL,
        CONSTRAINT \`FK_employee_reviews\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE \`feedback\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`comments\` TEXT NOT NULL,
        \`author_id\` INT NOT NULL,
        \`review_id\` INT NOT NULL,
        \`submitted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`deleted_at\` TIMESTAMP DEFAULT NULL,
        CONSTRAINT \`FK_feedback_author\` FOREIGN KEY (\`author_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_feedback_review\` FOREIGN KEY (\`review_id\`) REFERENCES \`reviews\`(\`id\`) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE \`reviews_participants\` (
        \`review_id\` INT NOT NULL,
        \`employee_id\` INT NOT NULL,
        PRIMARY KEY (\`review_id\`, \`employee_id\`),
        CONSTRAINT \`FK_review_participant\` FOREIGN KEY (\`review_id\`) REFERENCES \`reviews\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_participant_review\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`reviews_participants\``);
    await queryRunner.query(`DROP TABLE \`feedback\``);
    await queryRunner.query(`DROP TABLE \`reviews\``);
    await queryRunner.query(`DROP TABLE \`employees\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
