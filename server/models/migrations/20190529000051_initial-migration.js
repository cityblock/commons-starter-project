exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('pokemon', pokemon => {
      pokemon
        .uuid('id')
        .primary()
        .notNullable();
      pokemon
        .integer('pokemonNumber')
        .notNullable()
        .unique();
      pokemon
        .string('name')
        .notNullable()
        .unique();
      pokemon.integer('attack').notNullable();
      pokemon.integer('defense').notNullable();
      pokemon
        .enu('pokeType', [
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
        ])
        .notNullable();
      pokemon
        .json('moves')
        .notNullable()
        .defaultTo('[]');
      pokemon.string('imageUrl').notNullable();
      pokemon.timestamp('createdAt').defaultTo(knex.fn.now());
      pokemon.timestamp('updatedAt').defaultTo(knex.fn.now());
      pokemon.timestamp('deletedAt').nullable();
    })
    .createTable('item', item => {
      item
        .uuid('id')
        .primary()
        .notNullable();
      item.string('name').notNullable();
      item
        .uuid('pokemonId')
        .references('id')
        .inTable('pokemon')
        .notNullable();
      item.integer('price').notNullable();
      item.integer('happiness').notNullable();
      item.string('imageUrl').notNullable();
      item.timestamp('createdAt').defaultTo(knex.fn.now());
      item.timestamp('updatedAt').defaultTo(knex.fn.now());
      item.timestamp('deletedAt').nullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('item').dropTableIfExists('pokemon');
};
