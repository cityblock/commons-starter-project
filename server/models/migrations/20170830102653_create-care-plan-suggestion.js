exports.up = function(knex, Promise) {
  return (
    // concernId OR goalSuggestionTemplateId must be null, but NOT both
    knex.schema.createTableIfNotExists('care_plan_suggestion', function(table) {
      table.string('id').primary();
      table
        .string('patientId')
        .references('id')
        .inTable('patient');
      table.enu('suggestionType', ['concern', 'goal']);
      table
        .string('concernId')
        .references('id')
        .inTable('concern');
      table
        .string('goalSuggestionTemplateId')
        .references('id')
        .inTable('goal_suggestion_template');
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
      table.unique([
        'concernId',
        'goalSuggestionTemplateId',
        'patientId',
        'dismissedAt',
        'acceptedAt',
      ]);
      table.index('patientId');
      table.index('dismissedAt');
      table.index('acceptedAt');
    }).raw(`
      ALTER TABLE care_plan_suggestion
      ADD CONSTRAINT "one_and_only_one_of_concernId_or_goalSuggestionTemplateId"
      CHECK (("concernId" IS NULL) <> ("goalSuggestionTemplateId" IS NULL));
    `)
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('care_plan_suggestion');
};
