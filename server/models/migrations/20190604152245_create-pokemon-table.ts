import * as Knex from 'knex';
import { PokeType } from '../../constants/poke-types';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('pokemon', t => {
    t.uuid('id')
      .primary()
      .notNullable();
    t.integer('pokemonNumber')
      .unique()
      .unsigned()
      .notNullable();
    t.string('name')
      .unique()
      .notNullable();
    t.integer('attack').notNullable();
    t.integer('defense').notNullable();
    t.enu(
      'pokeType',
      Object.keys(PokeType).filter(k => typeof PokeType[k as any] === 'number'),
    ).notNullable();
    t.json('moves')
      .defaultTo('[]')
      .notNullable();
    t.string('imageUrl').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
    /* note we mark things as deleted, but rarely
    delete them in our database (“soft deletion”)*/
    t.timestamp('deletedAt');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('pokemon');
}
