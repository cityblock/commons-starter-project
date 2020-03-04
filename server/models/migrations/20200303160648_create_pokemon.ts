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
}

/*
-id (primary key, unique, uuid, not null) ­ note we use uuid rather than integer ids
-pokemonNumber (integer, not null, unique)
-name (string, not null, unique)
-attack (integer, not null)
-defense (integer, not null)
-pokeType (enum, not null, one of: normal, grass, fire, water, electric, psychic, ghost, dark, fairy, rock, ground, steel, flying, fighting, bug, ice, dragon, poison)
-moves (json, not null, default [])
-imageUrl (string, not null)
-createdAt (timestamp, default to the current time)
-updatedAt (timestamp, default to the current time)
deletedAt (timestamp, nullable) ­ note we mark things as deleted, but rarely ever actually delete them in our database (“soft deletion”)
*/