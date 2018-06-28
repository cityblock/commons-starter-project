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
      'textConsent',
      'treatmentConsent',
      'phiSharingConsent'
    ))
  `).raw(`
    UPDATE "patient_document"
    SET "documentType" = 'treatmentConsent'
    WHERE "documentType" = 'cityblockConsent'
  `).raw(`
    UPDATE "patient_document"
    SET "documentType" = 'phiSharingConsent'
    WHERE "documentType" = 'hipaaConsent'
  `).raw(`
    ALTER TABLE "patient_document"
    DROP CONSTRAINT "patient_document_documentType_check",
    ADD CONSTRAINT "patient_document_documentType_check"
    CHECK ("documentType" IN (
      'hra2010eApplication',
      'accessARideApplication',
      'phiSharingConsent',
      'treatmentConsent',
      'epicSeniorRxApplication',
      'hcp',
      'hieHealthixConsent',
      'hieHealthixDenial',
      'hieHealthixWithdrawal',
      'homecareReferral',
      'homeHealthFacetoFaceCertification',
      'm11q',
      'map2015',
      'molstForDisabilities',
      'molst',
      'privacyPracticesNotice',
      'socialSecurityDisability',
      'textConsent'
    ))
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    UPDATE "patient_document"
    SET "documentType" = NULL
    WHERE "documentType" IN (
      'hra2010eApplication',
      'accessARideApplication',
      'epicSeniorRxApplication',
      'hieHealthixWithdrawal',
      'hieHealthixDenial',
      'homecareReferral',
      'homeHealthFacetoFaceCertification',
      'm11q',
      'map2015',
      'molstForDisabilities',
      'privacyPracticesNotice',
      'socialSecurityDisability'
    )
  `).raw(`
    ALTER TABLE "patient_document"
    DROP CONSTRAINT "patient_document_documentType_check",
    ADD CONSTRAINT "patient_document_documentType_check"
    CHECK ("documentType" IN (
      'cityblockConsent',
      'hipaaConsent',
      'hieHealthixConsent',
      'hcp',
      'molst',
      'textConsent',
      'treatmentConsent',
      'phiSharingConsent'
    ))
  `).raw(`
    UPDATE "patient_document"
    SET "documentType" = 'cityblockConsent'
    WHERE "documentType" = 'treatmentConsent'
  `).raw(`
    UPDATE "patient_document"
    SET "documentType" = 'hipaaConsent'
    WHERE "documentType" = 'phiSharingConsent'
  `).raw(`
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
