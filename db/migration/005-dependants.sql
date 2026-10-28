-- Migration 005: dependants move into the student profile (completed once,
-- before any application — CLAUDE.md) instead of being re-entered on every
-- Welfare application that needs a Dependants Form.

USE sdcl_portal;

CREATE TABLE IF NOT EXISTS dependants (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id   VARCHAR(20) NOT NULL,
  name         VARCHAR(190) NOT NULL,
  ic_number    VARCHAR(20) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  status       ENUM('Employed', 'Unemployed', 'Self-Employed', 'Study') NOT NULL,
  income       DECIMAL(10,2) NULL COMMENT 'Required for Employed and Self-Employed',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dependants_student FOREIGN KEY (student_id) REFERENCES students(student_id),
  INDEX idx_dependants_student (student_id)
) ENGINE=InnoDB;
