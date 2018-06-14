exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    ALTER TABLE "patient_document"
    DROP CONSTRAINT "patient_document_documentType_check",
    ADD CONSTRAINT "patient_document_documentType_check"
    CHECK ("documentType" IN (
      'cityblockConsent',
      'hipaaConsent',
      'hieHealthixConsent',
      'hcp',
      'molst',
      'textConsent'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    UPDATE "patient_document"
    SET "documentType" = 'cityblockConsent'
    WHERE "documentType" = 'textConsent'
  `).raw(`
    ALTER TABLE "patient_document"
    DROP CONSTRAINT "patient_document_documentType_check",
    ADD CONSTRAINT "patient_document_documentType_check"
    CHECK ("documentType" IN (
      'cityblockConsent',
      'hipaaConsent',
      'hieHealthixConsent',
      'hcp',
      'molst'
    ))
  `);
};
