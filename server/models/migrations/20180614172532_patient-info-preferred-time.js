exports.up = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table.enu('preferredContactTime', ['morning', 'afternoon', 'evening']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('patient_info', table => {
    table.dropColumn('preferredContactTime');
  });
};
