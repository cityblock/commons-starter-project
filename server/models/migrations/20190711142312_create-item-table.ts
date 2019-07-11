import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  const itemsExist = await knex.schema.hasTable('item');
  if (!itemsExist) {
    await knex.schema.createTable('item', table => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      // review commons
      table
        .uuid('pokemonId')
        .references('id')
        .inTable('pokemon')
        .notNullable();
      table.integer('price').notNullable();
      table.integer('happiness').notNullable();
      table.string('imageUrl').notNullable();
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');
    });
  }
  // return knex.schema;
}

export async function down(knex: Knex): Promise<any> {
  // type guard ??
  if (knex.schema.hasTable('item')) {
    return knex.schema.dropTable('item');
  }
}
