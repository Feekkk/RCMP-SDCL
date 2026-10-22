-- Migration 002: audit trail for logins, profile/consent changes, and later
-- application status changes and approval decisions. Retained 4 years,
-- flagged (never auto-deleted) after that per data retention rules.

USE sdcl_portal;

CREATE TABLE IF NOT EXISTS audit_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  actor_type    ENUM('student', 'staff', 'system') NOT NULL,
  actor_id      VARCHAR(20) NULL,
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100) NULL,
  entity_id     VARCHAR(100) NULL,
  details       JSON NULL COMMENT 'Never store decrypted phone/bank values here',
  ip_address    VARCHAR(64) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  retention_flagged_at DATETIME NULL,
  INDEX idx_audit_actor (actor_type, actor_id),
  INDEX idx_audit_created_at (created_at)
) ENGINE=InnoDB;
