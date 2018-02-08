exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table
      .enu('permissions', ['green', 'pink', 'orange', 'blue', 'yellow', 'red'])
      .notNullable()
      .defaultTo('red');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('permissions');
  });
};
