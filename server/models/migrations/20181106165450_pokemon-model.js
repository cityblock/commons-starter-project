exports.up = function (knex, Promise) {
  return knex.schema.hasTable('pokemon').then(exists => {
    if (!exists) {
      return knex.schema.createTable('pokemon', table => {

        table
          .uuid('id')
          .primary()
          .notNullable();

        table
          .integer('pokemonNumber')
          .notNullable()
          .unique();

        table
          .string('name')
          .notNullable()
          .unique();

        table
          .integer('attack')
          .notNullable();

        table
          .integer('defense')
          .notNullable();

        table
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
            'poison'
          ])
          .notNullable();

        table
          .json('moves')
          .notNullable()
          .defaultTo([]);

        table
          .string('imageUrl')
          .notNullable();

        table
          .timestamp('createdAt')
          .notNullable();

        table
          .timestamp('updatedAt')
          .notNullable();

        table
          .timestamp('deletedAt')
          .notNullable();
      });
    }
  });
};

exports.down = function (knex, Promise) {

};
