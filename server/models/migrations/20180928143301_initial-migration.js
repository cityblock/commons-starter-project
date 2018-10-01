exports.up = function (knex, Promise) {
  return knex.schema.hasTable('pokemon').then(exists => {
    if (!exists) {
      return knex.schema.createTable('pokemon', table => {
        table.uuid('id').primary().notNullable();
        table.integer('pokemonNumber').unique().notNullable();
        table.string('name').unique().notNullable();
        table.integer('attack').notNullable();
        table.integer('defense').notNullable();
        table
          .enu('pokeType',
            [
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
              'poison'
            ])
          .notNullable();
        table.json('moves').notNullable().defaultTo('[]');
        table.string('imageUrl').notNullable();

        // timestamps
        table.timestamp('deletedAt');
        table.timestamp('createdAt').defaultTo(knex.raw('now()'));
        table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      });
    }
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.hasTable('pokemon').then(exists => {
    if (exists) {
      return knex.schema.dropTable('pokemon');
    }
  });
};