exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('computed_field_flag', table => {
    table.uuid('id').primary();
    table
      .uuid('patientAnswerId')
      .references('id')
      .inTable('patient_answer')
      .notNullable();
    table
      .uuid('userId')
      .references('id')
      .inTable('user')
      .notNullable();
    table.text('reason');

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('computed_field_flag');
};
