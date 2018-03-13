exports.up = function(knex, Promise) {
  return knex.schema
    .table('address', table => {
      table.timestamp('deletedAt');
    })
    .table('email', table => {
      table.timestamp('deletedAt');
    })
    .table('phone', table => {
      table.timestamp('deletedAt');
    })
    .table('patient_contact', table => {
      table.timestamp('deletedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table('address', table => {
      table.dropColumn('deletedAt');
    })
    .table('email', table => {
      table.dropColumn('deletedAt');
    })
    .table('phone', table => {
      table.dropColumn('deletedAt');
    })
    .table('patient_contact', table => {
      table.dropColumn('deletedAt');
    });
};
