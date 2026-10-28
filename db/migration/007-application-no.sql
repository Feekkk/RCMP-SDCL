-- Migration 007: persist the human-readable application reference
-- (e.g. WEL-000123) instead of deriving it on every read, so it can be
-- indexed and looked up directly.

USE sdcl_portal;

ALTER TABLE applications
  ADD COLUMN application_no VARCHAR(20) NULL COMMENT 'e.g. WEL-000123, MED-000045' AFTER id,
  ADD UNIQUE KEY uq_applications_application_no (application_no);
