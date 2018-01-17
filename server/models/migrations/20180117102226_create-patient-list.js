exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('patient_list', table => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table
      .integer('order')
      .defaultTo(1)
      .notNullable();
    table
      .uuid('answerId')
      .references('id')
      .inTable('answer')
      .notNullable();

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('patient_list');
};
