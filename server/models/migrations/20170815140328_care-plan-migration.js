
exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('concern', function (table) {
      table.string('id').primary();
      table.string('title')

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    // Join table for concern <-> answer many-to-many
    .createTableIfNotExists('concern_suggestion', function (table) {
      table.string('id').primary();
      table.string('concernId').references('id').inTable('concern');
      table.string('answerId').references('id').inTable('answer');
      table.unique(['answerId', 'concernId']);

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('patient_concern', function (table) {
      table.string('id').primary();
      table.string('concernId').references('id').inTable('concern');
      table.string('patientId').references('id').inTable('patient');
      table.integer('order');
      table.unique(['patientId', 'concernId']);
      table.timestamp('startedAt');
      table.timestamp('completedAt');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('goal_suggestion_template', function (table) {
      table.string('id').primary();
      table.string('title')

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('task_template', function (table) {
      table.string('id').primary();
      table.string('title')
      table.string('goalSuggestionTemplateId').references('id').inTable('goal_suggestion_template');
      table.enu('priority', ['low', 'medium', 'high'])
      table.bool('repeating')
      table.integer('completedWithinNumber')
      table.enu('completedWithinInterval', ['hour', 'day', 'week', 'month', 'year'])
      table.enu('careTeamAssigneeRole', [
        'familyMember', 'healthCoach', 'physician', 'nurseCareManager',
      ])

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    // Join table for goal suggestion <-> answer many-to-many
    .createTableIfNotExists('goal_suggestion', function (table) {
      table.string('id').primary();
      table.string('goalSuggestionTemplateId').references('id').inTable('goal_suggestion_template');
      table.string('answerId').references('id').inTable('answer');
      table.unique(['answerId', 'goalSuggestionTemplateId']);

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
    })
    .createTableIfNotExists('patient_goal', function (table) {
      table.string('id').primary();
      table.string('title')
      table.string('patientId').references('id').inTable('patient');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
    })
    .table('task', table => {
      table.string('patientGoalId').references('id').inTable('patient_goal');
    })
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('goal_suggestion')
    .dropTableIfExists('task_template')
    .dropTableIfExists('goal_suggestion_template')
    .dropTableIfExists('patient_concern')
    .dropTableIfExists('concern_suggestion')
    .table('task', table => {
      table.dropColumn('patientGoalId');
    })
    .dropTableIfExists('patient_goal')
    .dropTableIfExists('goal')
    .dropTableIfExists('concern');
};
