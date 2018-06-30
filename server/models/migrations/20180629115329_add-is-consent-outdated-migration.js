exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('patient_contact', table => {
    table.boolean('isConsentDocumentOutdated');
  });

  await knex.schema.alterTable('patient_external_organization', table => {
    table.boolean('isConsentDocumentOutdated');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('patient_contact', table => {
    table.dropColumn('isConsentDocumentOutdated');
  });

  await knex.schema.alterTable('patient_external_organization', table => {
    table.dropColumn('isConsentDocumentOutdated');
  });
};
