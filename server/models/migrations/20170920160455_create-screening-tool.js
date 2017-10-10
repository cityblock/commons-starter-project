exports.up = function (knex, Promise) {
  return knex.schema
    .createTableIfNotExists('screening_tool', function (table) {
      table.string('id').primary();
      table.string('title');
      table.string('riskAreaId').references('id').inTable('risk_area');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.unique(['title', 'deletedAt']);
      table.index('riskAreaId');
      table.index('deletedAt');
    })
    .createTableIfNotExists('screening_tool_score_range', function (table) {
      table.string('id').primary();
      table.string('screeningToolId').references('id').inTable('screening_tool');
      table.string('description');
      table.integer('minimumScore');
      table.integer('maximumScore');

      // timestamps
      table.timestamp('deletedAt');
      table.timestamp('createdAt').defaultTo(knex.raw('now()'));
      table.timestamp('updatedAt').defaultTo(knex.raw('now()'));

      // indexes
      table.index('screeningToolId');
      table.index('deletedAt');
    })
    // More indexes
    .raw(
      'create unique index screening_tool_score_range_screeningtoolid_minimum_score on screening_tool_score_range ("screeningToolId", "minimumScore") where "deletedAt" IS NULL;',
    )
    .raw(
      'create unique index screening_tool_score_range_screeningtoolid_maximum_score on screening_tool_score_range ("screeningToolId", "maximumScore") where "deletedAt" IS NULL;',
    );
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('screening_tool_score_range')
    .dropTableIfExists('screening_tool');
};
