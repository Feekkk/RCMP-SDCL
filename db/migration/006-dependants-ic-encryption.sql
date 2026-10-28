-- Migration 006: dependant IC numbers get the same reversible AES-256-GCM
-- encryption as phone/bank numbers (CLAUDE.md: reversible encryption for
-- sensitive identifiers, never hashed). No data to migrate — fresh build.

USE sdcl_portal;

ALTER TABLE dependants
  DROP COLUMN ic_number,
  ADD COLUMN ic_number_enc VARBINARY(512) NOT NULL
    COMMENT 'AES-256-GCM ciphertext (iv+tag+data), never plaintext'
    AFTER name;
