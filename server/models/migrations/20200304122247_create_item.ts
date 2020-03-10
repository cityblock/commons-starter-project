import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  // tslint:disable-next-line: only-arrow-functions
  return knex.schema.createTable('item', function(t) {
    t.uuid('id')
      .primary()
      .notNullable();
    t.string('name').notNullable();
    t.uuid('pokemonId')
      .notNullable()
      .references('pokemon.id');
    t.integer('price').notNullable();
    t.integer('happiness').notNullable();
    t.string('imageUrl').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
    t.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('item');
}
