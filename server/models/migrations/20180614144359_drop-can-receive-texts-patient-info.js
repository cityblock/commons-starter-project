exports.up = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table.dropColumn('canReceiveTexts');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table
      .boolean('canReceiveTexts')
      .defaultTo(false)
      .notNullable();
  });
};
