import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('item', t => {
    t.uuid('id')
      .primary()
      .notNullable();
    t.string('name').notNullable();
    t.uuid('pokemonId')
      .references('id')
      .inTable('pokemon')
      .onDelete('CASCADE')
      .notNullable();
    t.integer('price').notNullable();
    t.integer('happiness').notNullable();
    t.string('imageUrl').notNullable();
    t.timestamp('createdAt').defaultTo(knex.fn.now());
    t.timestamp('updatedAt').defaultTo(knex.fn.now());
    /* note we mark things as deleted, but rarely
    delete them in our database (“soft deletion”)*/
    t.timestamp('deletedAt');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('item');
}
