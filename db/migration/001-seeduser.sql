-- Migration 001: students + staff tables.
-- Fresh build — no data is migrated from the old UNIFA system (CLAUDE.md);
-- this migration creates the tables, it does not import legacy rows.

CREATE DATABASE IF NOT EXISTS sdcl_portal
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sdcl_portal;

CREATE TABLE IF NOT EXISTS students (
  student_id        VARCHAR(20)  NOT NULL PRIMARY KEY,
  oid               VARCHAR(64)  NULL UNIQUE COMMENT 'Azure AD object id (Microsoft SSO), null until SSO is enabled',
  email             VARCHAR(190) NOT NULL UNIQUE COMMENT 'Must be @s.unikl.edu.my once SSO is enforced',
  password_hash     VARCHAR(255) NULL COMMENT 'bcrypt hash, dev-only login path (ENABLE_PASSWORD_LOGIN=true)',
  name              VARCHAR(190) NULL,
  program           VARCHAR(190) NULL,
  current_semester  VARCHAR(20)  NULL,
  contact_number_enc VARBINARY(512) NULL COMMENT 'AES-256-GCM ciphertext (iv+tag+data), never plaintext',
  bank_name         VARCHAR(190) NULL,
  bank_number_enc   VARBINARY(512) NULL COMMENT 'AES-256-GCM ciphertext (iv+tag+data), never plaintext',
  consent_at        DATETIME NULL COMMENT 'First time the student agreed to the consent form',
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at     DATETIME NULL,
  retention_flagged_at DATETIME NULL COMMENT 'Set when 4-year retention window has elapsed; awaiting admin review/delete'
) ENGINE=InnoDB;

-- Covers SD staff, CL staff, SRD staff, System Admin, and the Medical/Welfare
-- approval-board roles: HOD, DD, CEO, Board.
CREATE TABLE IF NOT EXISTS staff (
  staff_id      VARCHAR(20)  NOT NULL PRIMARY KEY,
  oid           VARCHAR(64)  NULL UNIQUE COMMENT 'Azure AD object id (Microsoft SSO), null until SSO is enabled',
  email         VARCHAR(190) NOT NULL UNIQUE COMMENT 'Must be @unikl.edu.my once SSO is enforced',
  password_hash VARCHAR(255) NULL COMMENT 'bcrypt hash, dev-only login path (ENABLE_PASSWORD_LOGIN=true)',
  name          VARCHAR(190) NULL,
  role          ENUM(
                  'SYSTEM_ADMIN',
                  'SD_STAFF',
                  'CL_STAFF',
                  'SRD_STAFF',
                  'HOD',
                  'DD',
                  'CEO',
                  'BOARD'
                ) NOT NULL,
  unit          ENUM('SD', 'CL', 'SRD') NULL COMMENT 'Unit this staff member belongs to; null for roles not tied to one unit (e.g. SYSTEM_ADMIN)',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME NULL
) ENGINE=InnoDB;
