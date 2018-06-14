exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.boolean('isConsentedForSubstanceUse');
    table.boolean('isConsentedForHiv');
    table.boolean('isConsentedForStd');
    table.boolean('isConsentedForGeneticTesting');
    table.boolean('isConsentedForFamilyPlanning');
    table
      .uuid('consentDocumentId')
      .references('id')
      .inTable('patient_document');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.dropColumn('isConsentedForSubstanceUse');
    table.dropColumn('isConsentedForHiv');
    table.dropColumn('isConsentedForStd');
    table.dropColumn('isConsentedForGeneticTesting');
    table.dropColumn('isConsentedForFamilyPlanning');
    table.dropColumn('consentDocumentId');
  });
};
