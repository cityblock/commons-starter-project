exports.up = function(knex, Promise) {
  return knex.schema
    .table('phone', table => {
      table.enu('type', ['home', 'work', 'mobile', 'other']);
      table.string('description');
    })
    .raw('DROP INDEX phone_number_unique;');
};

exports.down = function(knex, Promise) {
  return knex.schema.table('phone', table => {
    // delete columns that we will move to join tables
    table.dropColumn('type');
    table.dropColumn('description');

    table.unique('phoneNumber');
  });
};