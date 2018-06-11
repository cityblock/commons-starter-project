exports.up = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.unique('phone');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('user', table => {
    table.dropUnique('phone');
  });
};
