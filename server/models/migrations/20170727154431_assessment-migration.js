exports.up = function(knex, Promise) {
  return knex.schema
    .createTableIfNotExists('risk_area', table => {
      table.string('id').primary();
      table.string('title');
      table.integer('order');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('order');
    })
    .createTableIfNotExists('question', table => {
      table.string('id').primary();
      table.string('title');
      table.string('validatedSource');
      table.enu('answerType', ['dropdown', 'radio', 'freetext', 'multiselect']);
      table.enu('applicableIfType', ['allTrue', 'oneTrue']);
      table
        .string('riskAreaId')
        .references('id')
        .inTable('risk_area');
      table.integer('order');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('order');
    })
    .createTableIfNotExists('answer', table => {
      table.string('id').primary();
      table.string('displayValue');
      table.string('value');
      table.enu('valueType', ['string', 'boolean', 'number']);
      table.enu('riskAdjustmentType', ['increment', 'forceHighRisk']);
      table.bool('inSummary');
      table.string('summaryText');
      table
        .string('questionId')
        .references('id')
        .inTable('question');
      table.integer('order');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');

      // indexes
      table.index('order');
    })
    .createTableIfNotExists('question_condition', table => {
      table.string('id').primary();
      table
        .string('questionId')
        .references('id')
        .inTable('question');
      table
        .string('answerId')
        .references('id')
        .inTable('answer');

      // timestamps
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));
      table.timestamp('deletedAt');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('question_condition')
    .dropTableIfExists('answer')
    .dropTableIfExists('question')
    .dropTableIfExists('risk_area');
};
