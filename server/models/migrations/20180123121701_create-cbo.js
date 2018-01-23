exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('cbo', table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table
      .uuid('categoryId')
      .references('id')
      .inTable('cbo_category')
      .notNullable();
    table.string('address').notNullable();
    table.string('city').notNullable();
    table.string('state').notNullable();
    table.string('zip').notNullable();
    table.string('fax');
    table.string('phone').notNullable();
    table.string('url').notNullable();

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

    // indices
    table.index('categoryId');
    table.unique('name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cbo');
};
