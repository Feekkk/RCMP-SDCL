-- Migration 003: application engine (categories, applications, documents) for
-- the Welfare and Medical modules (CLAUDE.md build order step 2). Categories
-- are data, not hard-coded, so required fields/documents can change without a
-- schema change. Approvals/board workflow is a later migration.

USE sdcl_portal;

CREATE TABLE IF NOT EXISTS categories (
  id                 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  module             ENUM('WELFARE', 'MEDICAL') NOT NULL,
  code               VARCHAR(60)  NOT NULL COMMENT 'Stable slug, e.g. living-allowance',
  name               VARCHAR(190) NOT NULL,
  amount_label       VARCHAR(190) NULL COMMENT 'Display string, e.g. "Up to RM500"',
  notes              TEXT NULL,
  required_documents JSON NOT NULL COMMENT 'Array of {"label": string} the applicant must upload',
  sort_order         INT NOT NULL DEFAULT 0,
  is_active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_module_code (module, code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  student_id    VARCHAR(20) NOT NULL,
  category_id   INT UNSIGNED NOT NULL,
  module        ENUM('WELFARE', 'MEDICAL') NOT NULL,
  reason        TEXT NULL COMMENT 'Applicant''s description of their case',
  status        ENUM('PENDING', 'RECOMMENDED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  submitted_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at    DATETIME NULL,
  retention_flagged_at DATETIME NULL,
  CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(student_id),
  CONSTRAINT fk_applications_category FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_applications_student (student_id),
  INDEX idx_applications_module_status (module, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS application_documents (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  application_id    BIGINT UNSIGNED NOT NULL,
  label             VARCHAR(190) NOT NULL COMMENT 'Which required document this satisfies',
  original_filename VARCHAR(255) NOT NULL,
  stored_path       VARCHAR(500) NOT NULL COMMENT 'Path under the uploads dir; files are not encrypted (CLAUDE.md)',
  mime_type         VARCHAR(100) NOT NULL,
  size_bytes        INT UNSIGNED NOT NULL,
  uploaded_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_application_documents_application FOREIGN KEY (application_id) REFERENCES applications(id),
  INDEX idx_application_documents_application (application_id)
) ENGINE=InnoDB;

-- Seed the confirmed category list from CLAUDE.md ("Welfare and Medical categories").
INSERT INTO categories (module, code, name, amount_label, notes, required_documents, sort_order) VALUES
('WELFARE', 'living-allowance', 'Living Allowance / Accommodation', 'Up to RM500',
  'One-off assistance for basic living or accommodation expenses.',
  JSON_ARRAY(JSON_OBJECT('label', 'Bank account / statement')), 1),
('WELFARE', 'learning-aid', 'Learning Aid', 'Up to RM1,500 for the entire study period',
  'For a laptop or study-related gadgets. Mobile phones and entertainment devices are not covered. You must not already be receiving related financial aid, loans, or sponsorship from external sponsors.',
  JSON_ARRAY(JSON_OBJECT('label', 'Bank account / statement')), 2),
('WELFARE', 'umi', 'UniKL Meal Initiative (UMI)', NULL,
  'Covers basic meals only — not for non-essential food expenses.',
  JSON_ARRAY(JSON_OBJECT('label', 'Bank account / statement')), 3),
('WELFARE', 'medical-support-supply', 'Medical Support & Supply', 'Up to RM200',
  'One-time support during your studies for non-cosmetic medical aids, such as crutches, arm slings, back supports, or prescription glasses.',
  JSON_ARRAY(JSON_OBJECT('label', 'Health report from a certified specialist doctor')), 4),
('WELFARE', 'bereavement', 'Bereavement', 'RM1,000 / RM200',
  'RM1,000 to the next of kin upon the death of a registered UniKL student, or RM200 upon the death of a parent or spouse (each). Next-of-kin priority: spouse, then parent(s).',
  JSON_ARRAY(JSON_OBJECT('label', 'Death certificate'), JSON_OBJECT('label', 'Proof of relationship')), 5),
('WELFARE', 'travel-assistance-bereavement', 'Travel Assistance (Bereavement)', 'RM50 / RM300',
  'One-off travel assistance to return to your hometown due to the death of a parent or spouse. RM50 within Peninsular Malaysia, RM300 between East and Peninsular Malaysia.',
  JSON_ARRAY(JSON_OBJECT('label', 'Death certificate'), JSON_OBJECT('label', 'Proof of relationship')), 6),
('WELFARE', 'natural-disasters', 'Natural Disasters', 'RM200 per accident',
  'For eligible accidents in Malaysia during active study: floods, storms, thunderstorms, landslides, building collapse, fallen trees, or fires.',
  JSON_ARRAY(JSON_OBJECT('label', 'Photos of the disaster'), JSON_OBJECT('label', 'Police report')), 7),
('WELFARE', 'others', 'Others', 'Case-by-case',
  'For matters not covered by the categories above but that significantly affect your safety, well-being, or ability to study. Explain your case clearly.',
  JSON_ARRAY(JSON_OBJECT('label', 'Supporting documents as requested by the committee')), 8),
('MEDICAL', 'medical-outpatient', 'Medical Outpatient', 'RM100 per year',
  'Outpatient treatment only (clinic visits, minor procedures, prescribed medications). Must be submitted within 1 month of the treatment/visit date.',
  JSON_ARRAY(JSON_OBJECT('label', 'Supporting documents from the visit')), 1);
