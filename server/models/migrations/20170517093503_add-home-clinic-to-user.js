exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.string('homeClinicId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('homeClinicId');
  });
};
