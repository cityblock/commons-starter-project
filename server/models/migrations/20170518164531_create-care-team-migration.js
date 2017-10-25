exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('care_team', function(table) {
    table.string('id').primary();
    table
      .string('userId')
      .references('id')
      .inTable('user');
    table
      .string('patientId')
      .references('id')
      .inTable('patient');
    table.unique(['userId', 'patientId']);

    // timestamps
    table.timestamp('deletedAt');
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('care_team');
};
