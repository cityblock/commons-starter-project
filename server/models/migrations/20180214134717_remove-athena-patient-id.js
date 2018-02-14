exports.up = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('athenaPatientId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.integer('athenaPatientId');
    table.unique('athenaPatientId');
  });
};
