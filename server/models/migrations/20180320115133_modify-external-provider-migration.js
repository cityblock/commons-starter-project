exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_external_provider', table => {
    table.string('roleFreeText');
    table.dropColumn('isMedicalSpecialist');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_external_provider', table => {
    table.dropColumn('roleFreeText');
    table.boolean('isMedicalSpecialist');
  });
};
