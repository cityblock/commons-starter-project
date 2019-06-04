import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('item', tableBuilder => {
    tableBuilder
      .uuid('id')
      .unique()
      .notNullable();
    tableBuilder.string('name').notNullable();
    tableBuilder
      .uuid('pokemonId')
      .references('id')
      .inTable('pokemon')
      .notNullable();
    tableBuilder.integer('price').notNullable();
    tableBuilder.integer('happiness').notNullable();
    tableBuilder.string('imageUrl').notNullable();
    tableBuilder.timestamp('createdAt').defaultTo(knex.fn.now());
    tableBuilder.timestamp('updatedAt').defaultTo(knex.fn.now());
    tableBuilder.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('item');
}
