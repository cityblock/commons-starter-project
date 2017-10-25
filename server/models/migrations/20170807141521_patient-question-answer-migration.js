exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('patient_answer', table => {
    table.string('id').primary();
    table.boolean('applicable');
    table
      .string('patientId')
      .references('id')
      .inTable('patient');
    table
      .string('answerId')
      .references('id')
      .inTable('answer');
    table.string('answerValue');

    // timestamps
    table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    table.timestamp('deletedAt');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('patient_answer');
};
