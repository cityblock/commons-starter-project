exports.up = function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.string('relationFreeText');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('patient_contact', table => {
    table.dropColumn('relationFreeText');
  });
};
