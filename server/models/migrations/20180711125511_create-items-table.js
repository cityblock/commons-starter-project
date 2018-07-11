exports.up = async function(knex, Promise) {
  const exists = await knex.schema.hasTable('item');
  if (!exists) {
    return knex.schema.createTable('item', table => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table
        .uuid('pokemonId')
        .references('id')
        .inTable('pokemon')
        .notNullable();
      table.index('pokemonId');
      table.integer('price').notNullable();
      table.integer('happiness').notNullable();
      table.string('imageUrl').notNullable();
      table
        .timestamp('createdAt')
        .defaultTo(knex.raw('now()'))
        .notNullable();
      table
        .timestamp('updatedAt')
        .defaultTo(knex.raw('now()'))
        .notNullable();
      table.timestamp('deletedAt');
    });
  }
};

exports.down = async function(knex, Promise) {
  const exists = await knex.schema.hasTable('item');
  if (exists) {
    return knex.schema.dropTable('item');
  }
};
