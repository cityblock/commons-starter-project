import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  const exists = await knex.schema.hasTable('pokemon');
  if (!exists) {
    await knex.schema.createTable('pokemon', table => {
      table.uuid('id').primary();
      table
        .integer('pokemonNumber')
        .notNullable()
        .unique();
      table.integer('attack').notNullable();
      table.integer('defense').notNullable();
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
          'poison',
        ])
        .notNullable();
      table
        .json('moves')
        .notNullable()
        .defaultTo('[]');
      table.string('imageUrl').notNullable();
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');
    });
  }
}

export async function down(knex: Knex): Promise<any> {
  // type guard ??
  if (knex.schema.hasTable('pokemon')) {
    // await instead of return
    await knex.schema.dropTable('pokemon');
  }
}
