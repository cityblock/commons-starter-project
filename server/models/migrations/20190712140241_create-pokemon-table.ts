import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  const exists = await knex.schema.hasTable('pokemon');
  if (!exists) return knex.schema.createTable('pokemon', table => {
    table.uuid('id').primary();
    table.integer('pokemonNumber').notNullable().unique();
    table.string('name').notNullable().unique();
    table.integer('attack').notNullable();
    table.integer('defense').notNullable();
    table.json('moves').notNullable().defaultTo('[]');
    table.string('imageUrl').notNullable();
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('deletedAt');

    table.
      enu('pokeType', [
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
      ]).
      notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  const exists = await knex.schema.hasTable('pokemon');
  if (exists) return knex.schema.dropTable('pokemon');
}
