exports.up = async function(knex, Promise) {
  await knex.schema.alterTable('patient_contact', table => {
    table.boolean('isConsentedForMentalHealth');
  });

  await knex.schema.alterTable('patient_external_organization', table => {
    table.boolean('isConsentedForMentalHealth');
  });
};

exports.down = async function(knex, Promise) {
  await knex.schema.alterTable('patient_external_organization', table => {
    table.dropColumn('isConsentedForMentalHealth');
  });
};
