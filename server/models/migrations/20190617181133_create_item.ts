import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('item', item => {
    item
      .uuid('id')
      .primary()
      .notNullable();
    item.string('name').notNullable();
    item
      .uuid('pokemonId')
      .references('id')
      .inTable('pokemon')
      .notNullable();
    item.integer('price').notNullable();
    item.integer('happiness').notNullable();
    item.string('imageUrl').notNullable();
    item.timestamp('createdAt').defaultTo(knex.fn.now());
    item.timestamp('updatedAt').defaultTo(knex.fn.now());
    item.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('item');
}
