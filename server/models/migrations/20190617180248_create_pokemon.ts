import * as Knex from 'knex';
import { PokeType } from '../PokeType';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pokemon', pokemon => {
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
    pokemon.enu('pokeType', Object.keys(PokeType)).notNullable();
    pokemon
      .json('moves')
      .notNullable()
      .defaultTo('[]');
    pokemon.string('imageUrl').notNullable();
    pokemon.timestamp('createdAt').defaultTo(knex.fn.now());
    pokemon.timestamp('updatedAt').defaultTo(knex.fn.now());
    pokemon.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('pokemon');
}
