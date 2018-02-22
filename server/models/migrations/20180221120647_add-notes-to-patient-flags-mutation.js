exports.up = function(knex, Promise) {
  return knex.schema.table('patient_data_flag', table => {
    table.text('notes');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_data_flag', table => {
    table.dropColumn('notes');
  });
};
