exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('cbo_category', table => {
    table.uuid('id').primary();
    table.string('title').notNullable();

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

    // indices
    table.unique('title');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cbo_category');
};
