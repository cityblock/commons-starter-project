exports.up = function(knex, Promise) {
  return knex.schema.hasTable('pokemon').then(exists => {
    if (!exists) {
      return knex.schema.createTable('pokemon', table => {
        table.uuid('id').primary();
        table
          .integer('pokemonNumber')
          .unique()
          .notNullable();
        table
          .string('name')
          .unique()
          .notNullable();
        table.integer('attack').notNullable();
        table.integer('defense').notNullable();
        table.enu('pokeType', [
          'normal',
          'grass',
          'fire',
          'water',
          'electric',
          'psychic',
          'ghost',
          'dark',
          'fairy',
          'rock',
          'ground',
          'steel',
          'flying',
          'fighting',
          'bug',
          'ice',
          'dragon',
          'poison',
        ]);
        table.json('moves').notNullable();
        table.string('imageUrl').notNullable();
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
        table.timestamp('deletedAt');
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('pokemon').then(exists => {
    if (exists) {
      return knex.schema.dropTable('pokemon');
    }
  });
};
