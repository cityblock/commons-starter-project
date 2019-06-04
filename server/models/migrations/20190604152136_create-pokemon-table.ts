import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pokemon', tableBuilder => {
    tableBuilder
      .uuid('id')
      .primary()
      .notNullable();
    tableBuilder
      .integer('pokemonNumber')
      .notNullable()
      .unique();
    tableBuilder
      .string('name')
      .notNullable()
      .unique();
    tableBuilder.integer('attack').notNullable();
    tableBuilder.integer('defense').notNullable();
    tableBuilder
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
    tableBuilder
      .json('moves')
      .notNullable()
      .defaultTo('[]');
    tableBuilder.string('imageUrl').notNullable();
    tableBuilder.timestamp('createdAt').defaultTo(knex.fn.now());
    tableBuilder.timestamp('updatedAt').defaultTo(knex.fn.now());
    tableBuilder.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('pokemon');
}
