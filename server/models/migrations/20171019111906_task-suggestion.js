exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('task_suggestion', function(table) {
      table.string('id').primary();
      table
        .string('taskTemplateId')
        .references('id')
        .inTable('task_template');
      table
        .string('answerId')
        .references('id')
        .inTable('answer');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('patient_task_suggestion', function(table) {
      table.string('id').primary();
      table
        .string('patientId')
        .references('id')
        .inTable('patient');
      table
        .string('taskTemplateId')
        .references('id')
        .inTable('task_template');
      table
        .string('acceptedById')
        .references('id')
        .inTable('user');
      table
        .string('dismissedById')
        .references('id')
        .inTable('user');
      table.text('dismissedReason');

      // timestamps
      table.timestamp('dismissedAt');
      table.timestamp('acceptedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.unique(['taskTemplateId', 'patientId', 'dismissedAt', 'acceptedAt']);
      table.index('patientId');
      table.index('dismissedAt');
      table.index('acceptedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('patient_task_suggestion')
    .dropTableIfExists('task_suggestion');
};
