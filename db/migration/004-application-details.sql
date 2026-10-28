-- Migration 004: align category document labels with FORM.md exactly, and add
-- a column for the category-specific fields (amount requested, purpose,
-- dependants, medical claim details, etc.) now captured on the apply form.

USE sdcl_portal;

ALTER TABLE applications
  ADD COLUMN details JSON NULL COMMENT 'Category-specific answers captured on the form (amount requested, purpose, dependants, medical claim details, etc.) — see FORM.md' AFTER reason;

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Payslip'))
  WHERE module = 'WELFARE' AND code IN ('living-allowance', 'learning-aid', 'umi');

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Health Report from a Certified Doctor'))
  WHERE module = 'WELFARE' AND code = 'medical-support-supply';

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Death Certificate'), JSON_OBJECT('label', 'Proof of Relationship'))
  WHERE module = 'WELFARE' AND code IN ('bereavement', 'travel-assistance-bereavement');

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Disaster Pictures (Evidence)'), JSON_OBJECT('label', 'Police Report'))
  WHERE module = 'WELFARE' AND code = 'natural-disasters';

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Supporting Documents'))
  WHERE module = 'WELFARE' AND code = 'others';

UPDATE categories SET required_documents = JSON_ARRAY(JSON_OBJECT('label', 'Medical Receipt'))
  WHERE module = 'MEDICAL' AND code = 'medical-outpatient';
