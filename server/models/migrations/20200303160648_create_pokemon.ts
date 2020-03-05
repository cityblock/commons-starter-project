import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pokemon', function (t) {
    t.uuid('id').primary().notNullable()
    t.integer('pokemonNumber').notNullable().unique();
    t.string('name').notNullable().unique();
    t.integer('attack').notNullable();
    t.integer('defense').notNullable();
    t.enum('pokeType', [
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
    ]).notNullable();
    t.json('moves').notNullable().defaultTo('[]');
    t.string('imageUrl').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
    t.timestamp('deletedAt').nullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('pokemon');
}
