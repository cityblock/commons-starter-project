exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.string('phone');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropColumn('phone');
  });
};
