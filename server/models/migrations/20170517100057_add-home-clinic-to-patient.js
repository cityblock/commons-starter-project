exports.up = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.string('homeClinicId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient', table => {
    table.dropColumn('homeClinicId');
  });
};
