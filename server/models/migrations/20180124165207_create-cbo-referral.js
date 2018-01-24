exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('cbo_referral', table => {
    table.uuid('id').primary();
    table
      .uuid('categoryId')
      .references('id')
      .inTable('cbo_category')
      .notNullable();
    table
      .uuid('CBOId')
      .references('id')
      .inTable('cbo');
    table.string('name');
    table.string('url');
    table.string('diagnosis');

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('sentAt');
    table.timestamp('acknowledgedAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cbo_referral');
};
