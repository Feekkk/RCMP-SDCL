-- Migration 008: let System Admin configure, per fund (category), which
-- staff roles are responsible for recommending and approving it, instead of
-- that being fixed in code. Welfare normally flows through SD_STAFF then
-- CEO/BOARD; Medical has no recommendation step and goes straight to
-- HOD/DD. Seed those as the defaults, editable afterwards via the Manage
-- Funds admin page.

USE sdcl_portal;

ALTER TABLE categories
  ADD COLUMN recommender_roles JSON NULL COMMENT 'Array of staff role enum values allowed to recommend this fund' AFTER required_documents,
  ADD COLUMN approver_roles JSON NULL COMMENT 'Array of staff role enum values allowed to approve this fund' AFTER recommender_roles;

UPDATE categories SET recommender_roles = JSON_ARRAY('SD_STAFF') WHERE module = 'WELFARE';
UPDATE categories SET approver_roles = JSON_ARRAY('CEO', 'BOARD') WHERE module = 'WELFARE';
UPDATE categories SET approver_roles = JSON_ARRAY('HOD', 'DD') WHERE module = 'MEDICAL';
