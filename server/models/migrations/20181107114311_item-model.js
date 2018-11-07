exports.up = (knex, Promise) => (
  knex.schema.hasTable('item').then(exists => {
    if (!exists) {
      return knex.schema.createTable('item', table => {
        table.uuid('id').primary().notNullable();
        table.string('name').notNullable();
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
        table.timestamp('deletedAt').nullable();
      });
    }
  })
);

exports.down = (knex, Promise) => (
  knex.schema.hasTable('item').then(exists => {
    if (exists) {
      return knex.schema.dropTable('item');
    }
  })
);
