exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('patient_screening_tool_submission', function(table) {
    table.string('id').primary();
    table
      .string('screeningToolId')
      .references('id')
      .inTable('screening_tool');
    table
      .string('patientId')
      .references('id')
      .inTable('patient');
    table
      .string('userId')
      .references('id')
      .inTable('user');
    table.integer('score');

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

    // indexes
    table.unique(['screeningToolId', 'patientId', 'deletedAt']);
    table.index('screeningToolId');
    table.index('patientId');
    table.index('deletedAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('patient_screening_tool_submission');
};
