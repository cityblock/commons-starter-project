exports.up = function(knex, Promise) {
  return knex.schema.table('concern_suggestion', table => {
    table.dropColumn('updatedAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('concern_suggestion', table => {
    table.timestanp('updatedAt');
  });
};
