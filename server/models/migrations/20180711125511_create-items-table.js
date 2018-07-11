exports.up = async function(knex, Promise) {
  const exists = await knex.schema.hasTable('items');
  if (!exists) {
    return knex.schema.createTable('items', table => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table
        .uuid('pokemonId')
        .references('id')
        .inTable('pokemon')
        .notNullable()
        .unique();
      // should I index the foreign key?
      // table.index('pokemonId');
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
  const exists = await knex.schema.hasTable('items');
  if (exists) {
    return knex.schema.dropTable('items');
  }
};
