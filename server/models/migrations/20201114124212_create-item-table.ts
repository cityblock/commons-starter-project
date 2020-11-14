import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('item', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').unique().notNullable();
    table.uuid('pokemonId').references('id').inTable('pokemon').notNullable();
    table.integer('price').notNullable();
    table.integer('happiness').notNullable();
    table.string('imageUrl').notNullable();
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists('pokemon');
}