exports.up = function (knex, Promise) {
  return knex.schema.table('item', table => {
    table.index('pokemonId');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('item', table => {
    table.dropIndex('pokemonId');
  });
};