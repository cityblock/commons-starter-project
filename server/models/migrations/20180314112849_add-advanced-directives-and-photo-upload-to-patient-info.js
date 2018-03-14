exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.boolean('hasHealthcareProxy');
    table.boolean('hasMolst');
    table.boolean('hasDeclinedPhoto');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_info', table => {
    table.dropColumn('hasHealthcareProxy');
    table.dropColumn('hasMolst');
    table.dropColumn('hasDeclinedPhoto');
  });
};
